import { inscriptionSchema } from "$lib/formSchema";
import { auth } from "$lib/server/lucia";
import * as omnivox from "$lib/server/omnivox";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export const load = async () => {
    const form = await superValidate(inscriptionSchema);
    form.data.firstStep = true;
    return { form };
};

export const actions = {
    signup: async ({ locals, request }) => {
        const form = await superValidate(request, inscriptionSchema);

        const baseUrl = form.data.email.match(/\d{7}@(.*).qc.ca/)?.[1];
        if (!form.valid || !baseUrl) {
            return fail(400, { form });
        }

        try {
            if (!form.data.session) {
                // Login via Omnivox to verify the user's identity
                const login = await omnivox.login(form.data.email, form.data.omnivoxPassword);
                form.data.session = JSON.stringify(login.session.cookies);

                if (login.mfa) {
                    form.data.mfaId = login.mfa.id;
                    form.message = login.mfa.type;
                    return { form };
                }
            } else if (form.data.mfaId) {
                if (!form.data.code) {
                    return setError(form, "code", "Champ nécessaire");
                }

                const result = await omnivox.submitCode2FA(
                    form.data.code,
                    { cookies: JSON.parse(form.data.session), baseUrl },
                    form.data.mfaId
                );

                form.data.code = undefined;
                if (result.success) {
                    form.message = undefined;
                    form.data.session = JSON.stringify(result.session.cookies);
                    form.data.mfaId = "";
                } else {
                    return setError(form, "code", "Code invalide");
                }
            }

            const { html } = await omnivox.fetchSchedulePageHTML(
                { cookies: JSON.parse(form.data.session), baseUrl },
                2023,
                omnivox.Semester.Winter
            );
            const info = omnivox.schedulePageToName(html);

            // Everything it good!
            form.data.password = "";
            form.data.confirmPassword = "";
            form.data.firstName = info.firstName;
            form.data.lastName = info.lastName;

            if (form.data.firstStep) {
                form.data.firstStep = false;
                return { form };
            }
        } catch (e) {
            form.data.firstStep = true;
            return setError(form, "omnivoxPassword", "Mot de passe erroné");
        }

        if (!form.data.firstStep) {
            try {
                const user = await auth.createUser({
                    key: {
                        providerId: "email",
                        providerUserId: form.data.email,
                        password: form.data.password,
                    },
                    attributes: {
                        da: form.data.email.split("@")[0],
                        email: form.data.email,
                        firstName: form.data.firstName,
                        lastName: form.data.lastName,
                        avatar: form.data.firstName + form.data.email,
                    },
                });

                const session = await auth.createSession({ userId: user.userId, attributes: {} });
                locals.auth.setSession(session);
            } catch (e) {
                // If the account already exists
                form.data.firstStep = true;
                return setError(form, "email", "Un compte avec ce courriel existe déjà");
            }
        }

        return { form };
    },
} satisfies Actions;
