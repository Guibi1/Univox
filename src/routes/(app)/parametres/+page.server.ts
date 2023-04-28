import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

async function emailExists(email: string) {
    const user = await db.findUser({ email: email });
    return user !== null;
}

export const actions = {
    save: async ({ request, locals }) => {
        const data = await request.formData();
        const email = data.get("email")?.toString();

        if (!email || !/^[a-zA-Z0-9.+]+@([a-zA-Z0-9]+\.)+[a-zA-Z]+$/.test(email)) {
            return fail(400, { email, invalidEmail: true });
        }

        // Check if the new email is the same as the old email
        if (locals.user.email !== email) {
            if (await emailExists(email)) {
                return fail(400, { email, emailExists: true });
            }

            await db.updateUser(locals.user, { email: email });
        }

        return { email, success: true };
    },
} satisfies Actions;
