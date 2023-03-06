import * as db from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
    const token = cookies.get("token");

    if (token) {
        await db.deleteToken(token);
    }
    cookies.delete("token", { path: "/" });

    throw redirect(307, "/connexion");
}) satisfies PageServerLoad;
