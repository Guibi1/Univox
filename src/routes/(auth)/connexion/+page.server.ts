import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";
import { formSchema } from "./+page.svelte";

export const load = async () => {
    const form = await superValidate(formSchema);
    return { form };
};

export const actions = {
    login: async ({ request, cookies }) => {
        const form = await superValidate(request, formSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        const [user] = await Promise.all([
            await db.compareUserPassword(form.data.email, form.data.password),
            new Promise((r) => setTimeout(r, 600)),
        ]);

        if (!user) {
            return setError(form, "password", "Mot de passe eronné");
        }

        const token = await db.createToken(user);
        cookies.set("token", token, { path: "/", httpOnly: true, secure: true, sameSite: true });

        return { form };
    },
} satisfies Actions;
