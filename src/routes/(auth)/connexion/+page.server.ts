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

        const [passwordsMatch] = await Promise.all([
            await db.compareUserPassword(da, password),
            new Promise((r) => setTimeout(r, 600)),
        ]);

        if (!passwordsMatch) {
            return fail(401, { da, incorrect: true });
        }

        const token = await db.createToken(passwordsMatch);
        cookies.set("token", token, { path: "/", httpOnly: true, secure: true, sameSite: true });

        return { success: true };
    },
} satisfies Actions;
