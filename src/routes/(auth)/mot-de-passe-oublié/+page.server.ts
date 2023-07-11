import { resetPasswordSchema } from "$lib/formSchema";
import { auth } from "$lib/server/lucia";
import * as omnivox from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export const load = async () => {
    const form = await superValidate(resetPasswordSchema);
    return { form };
};

export const actions = {
    reset: async ({ request, url }) => {
        const form = await superValidate(request, resetPasswordSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await omnivox.login(form.data.email, form.data.omnivoxPassword);
        } catch (e) {
            return setError(form, "omnivoxPassword", "Mot de passe omnivox incorrect");
        }

        try {
            auth.updateKeyPassword("email", form.data.email, form.data.password);
        } catch {
            return setError(form, "email", "Aucun compte associé à cet email");
        }

        throw redirect(302, "/connexion?" + url.searchParams);
    },
} satisfies Actions;
