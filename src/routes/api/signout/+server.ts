import * as db from "$lib/server/db";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ cookies }) => {
    const token = cookies.get("token");

    if (token) {
        db.deleteToken(token);
    }
    cookies.delete("token", { path: "/" });

    throw redirect(303, "/connexion");
}) satisfies RequestHandler;
