import { auth } from "$lib/server/lucia";
import { emailSchema, passwordSchema } from "$lib/zod_schemas";
import { fail } from "@sveltejs/kit";
import { LuciaError } from "lucia";
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

        const [key] = await Promise.allSettled([
            auth.useKey("email", form.data.email.toLowerCase(), form.data.password),
            new Promise((r) => setTimeout(r, 600)),
        ]);

        if (key.status === "fulfilled") {
            const session = await auth.createSession({
                userId: key.value.userId,
                attributes: {},
            });
            locals.auth.setSession(session);
        } else if (
            key.reason instanceof LuciaError &&
            (key.reason.message === "AUTH_INVALID_KEY_ID" ||
                key.reason.message === "AUTH_INVALID_PASSWORD")
        ) {
            return setError(form, "password", "Mot de passe erroné");
        }

        return { form };
    },
} satisfies Actions;

const connexionSchema = z.object({ email: emailSchema, password: passwordSchema });
