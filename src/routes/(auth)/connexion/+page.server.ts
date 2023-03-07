import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const da = data.get("da")?.toString();
        const password = data.get("password")?.toString();

        if (!da || !/\d{7}/.test(da) || !password || !/.{8,}/.test(password)) {
            return fail(400, { da, missing: true });
        }

        const user = await db.compareUserPassword(da, password);
        if (!user) {
            return fail(401, { da, incorrect: true });
        }

        const token = await db.createToken(user);
        cookies.set("token", token, { path: "/", httpOnly: true });

        return { success: true };
    },
} satisfies Actions;
