import { auth } from "$lib/server/lucia";
import * as omnivox from "$lib/server/omnivox";
import { omnivoxLoginSchema, passwordSchema } from "$lib/zod_schemas";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export const load = async () => {
    const form = await superValidate(resetSchema);
    return { form };
};

export const actions = {
    reset: async ({ request, url }) => {
        const form = await superValidate(request, resetSchema);

        const baseUrl = form.data.email.match(/\d{7}@(.*).qc.ca/)?.[1];
        if (!form.valid || !baseUrl) {
            return fail(400, { form });
        }

        if (!form.data.session) {
            try {
                const login = await omnivox.login(form.data.email, form.data.omnivoxPassword);

                if (login.mfa) {
                    form.data.session = JSON.stringify(login.session.cookies);
                    form.data.mfaId = login.mfa.id;
                    form.message = login.mfa.type;
                    return { form };
                }
            } catch (e) {
                return setError(form, "omnivoxPassword", "Mot de passe omnivox incorrect");
            }
        } else {
            if (!form.data.code) {
                return setError(form, "code", "Champ nécessaire");
            }

            const result = await omnivox.submitCode2FA(
                form.data.code,
                { cookies: JSON.parse(form.data.session), baseUrl },
                form.data.mfaId
            );

            form.data.code = undefined;
            if (!result.success) {
                return setError(form, "code", "Code invalide");
            }
        }

        try {
            auth.updateKeyPassword("email", form.data.email, form.data.password);
        } catch {
            return setError(form, "email", "Aucun compte associé à cet email");
        }

        throw redirect(302, "/connexion?" + url.searchParams);
    },
} satisfies Actions;

const resetSchema = omnivoxLoginSchema.extend({ password: passwordSchema });
