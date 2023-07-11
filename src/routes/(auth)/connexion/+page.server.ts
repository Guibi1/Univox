import { connexionSchema } from "$lib/formSchema";
import { auth } from "$lib/server/lucia";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export const load = async () => {
    const form = await superValidate(connexionSchema);
    return { form };
};

export const actions = {
    login: async ({ locals, request }) => {
        const form = await superValidate(request, connexionSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const [key] = await Promise.all([
                await auth.useKey("email", form.data.email, form.data.password),
                new Promise((r) => setTimeout(r, 600)),
            ]);
            const session = await auth.createSession(key.userId);
            locals.auth.setSession(session);
        } catch {
            return setError(form, "password", "Mot de passe erroné");
        }

        return { form };
    },
} satisfies Actions;
