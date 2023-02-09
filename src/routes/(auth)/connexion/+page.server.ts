import * as db from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import bcrypt from "bcrypt";

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const da = data.get("da");
        const password = data.get("password");

        if (!da || !password) {
            return fail(400, { da, missing: true });
        }

        const user = await db.findUser({ da });
        if (!user || !(await bcrypt.compare(password.toString(), user.passwordHash))) {
            return fail(401, { da, incorrect: true });
        }

        // TODO: Manage tokens
        const token = "TOKEN";

        cookies.set("token", token, { path: "/", httpOnly: true });
        throw redirect(303, "/");
    },
} satisfies Actions;
