import { auth } from "$lib/server/lucia";
import { emailSchema, passwordSchema } from "$lib/zod_schemas";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
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
            const session = await auth.createSession({ userId: key.userId, attributes: {} });
            locals.auth.setSession(session);
        } catch (e) {
            return setError(form, "password", "Mot de passe erroné");
        }

        return { form };
    },
} satisfies Actions;

const connexionSchema = z.object({ email: emailSchema, password: passwordSchema });
