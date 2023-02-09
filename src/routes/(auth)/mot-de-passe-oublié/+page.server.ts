import * as db from "$lib/server/db";
import { login } from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const da = data.get("da");
        const password = data.get("password");
        const newPassword = data.get("newPassword")?.toString();

        if (!da || !password || !newPassword) {
            return fail(400, { da, missing: true });
        }

        try {
            await login(da.toString(), password.toString());
        } catch (e) {
            return fail(401, { da, incorrect: true });
        }

        const user = await db.findUser({ da });
        if (!user) {
            // ? Maybe not fail so that the users can't find all the DA that are registered
            return fail(401, { da, noUser: true });
        }

        await db.updateUserPassword(user?._id, await bcryptjs.hash(newPassword.toString(), 11));
        throw redirect(303, "/connexion");
    },
} satisfies Actions;
