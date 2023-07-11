import { inscriptionPartialSchema, inscriptionSchema } from "$lib/formSchema";
import * as db from "$lib/server/db";
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
    omnivoxLogin: async ({ request }) => {
        const form = await superValidate(request, inscriptionPartialSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            // Login via Omnivox to verify the user's identity
            const login = await omnivox.login(form.data.email, form.data.omnivoxPassword);
            form.data.session = JSON.stringify(login.session.cookies);

            if (login.mfa) {
                form.data.mfaId = login.mfa.id;
                form.message = login.mfa.type;
                return { form };
            }

            const { html } = await omnivox.fetchSchedulePageHTML(
                login.session,
                2023,
                omnivox.Semester.Winter
            );
            const info = omnivox.schedulePageToName(html);

            // Make sure the DA doesn't already has an account
            if (await db.findUser({ email: form.data.email })) {
                return setError(form, "email", "Un compte avec ce courriel existe déjà");
            }

            // Everything it good!
            form.data.firstStep = false;
            form.data.password = "";
            form.data.confirmPassword = "";
            form.data.firstName = info.firstName;
            form.data.lastName = info.lastName;

            return { form };
        } catch (e) {
            console.log("🚀 ~ file: +page.server.ts:47 ~ firstStep: ~ e:", e);
            return setError(form, "omnivoxPassword", "Mot de passe erroné");
        }
    },

    omnivox2fa: async ({ request }) => {
        const form = await superValidate(request, inscriptionPartialSchema);

        const baseUrl = form.data.email.match(/\d{7}@(.*).qc.ca/)?.[1];
        if (!form.valid || !baseUrl) {
            return fail(400, { form });
        }
        if (!form.data.code) {
            return setError(form, "code", "Champ nécéssaire");
        }

        const result = await omnivox.submitCode2FA(
            form.data.code,
            { cookies: JSON.parse(form.data.session), baseUrl },
            form.data.mfaId
        );

        if (!result.success) {
            return setError(form, "code", "Code invalide");
        }

        console.log(
            "🚀 ~ file: +page.server.ts:87 ~ omnivox2fa: ~ result.session:",
            result.session
        );
        const { html } = await omnivox.fetchSchedulePageHTML(
            result.session,
            2023,
            omnivox.Semester.Winter
        );
        const info = omnivox.schedulePageToName(html);

        form.data.session = JSON.stringify(result.session.cookies);
        form.data.firstStep = false;
        form.data.password = "";
        form.data.confirmPassword = "";
        form.data.firstName = info.firstName;
        form.data.lastName = info.lastName;

        return { form };
    },

    accountCreation: async ({ locals, request }) => {
        const form = await superValidate(request, inscriptionSchema);

        const baseUrl = form.data.email.match(/\d{7}@(.*).qc.ca/)?.[1];
        if (!form.valid || !baseUrl) {
            return fail(400, { form });
        }

        // Login via Omnivox to verify the user's identity
        try {
            const { html } = await omnivox.fetchSchedulePageHTML(
                { cookies: JSON.parse(form.data.session), baseUrl },
                2023,
                omnivox.Semester.Winter
            );
            const info = omnivox.schedulePageToName(html);

            form.data.firstName = info.firstName;
            form.data.lastName = info.lastName;
        } catch {
            form.data.firstStep = true;
            return setError(form, "omnivoxPassword", "Mot de passe erroné");
        }

        try {
            const user = await auth.createUser({
                primaryKey: {
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

            const session = await auth.createSession(user.id);
            locals.auth.setSession(session);
        } catch (e) {
            console.log("🚀 ~ file: +page.server.ts:145 ~ accountCreation: ~ e:", e);
            // Make sure the DA doesn't already has an account
            form.data.firstStep = true;
            return setError(form, "email", "Un compte avec ce courriel existe déjà");
        }

        return { form };
    },
} satisfies Actions;
