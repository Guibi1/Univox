import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    reset: async ({ request, url }) => {
        const data = await request.formData();
        const da = data.get("da")?.toString();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();
        const newPassword = data.get("newPassword")?.toString();

        if (
            !da ||
            !/\d{7}/.test(da) ||
            !omnivoxPassword ||
            !newPassword ||
            !/.{8,}/.test(newPassword)
        ) {
            return fail(400, { da, missing: true });
        }

        try {
            await omnivox.login(da, omnivoxPassword);
        } catch (e) {
            return fail(401, { da, omnivoxIncorrect: true });
        }

        const user = await db.findUser({ da });
        if (!user) {
            return fail(401, { da, incorrect: true });
        }

        await db.updateUserPassword(user._id, newPassword);

        throw redirect(302, "/connexion?" + url.searchParams);
    },
} satisfies Actions;
