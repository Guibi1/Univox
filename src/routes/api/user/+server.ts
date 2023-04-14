import { json } from "@sveltejs/kit";
import { error } from "console";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);

    return json({ success: true, user: locals.user });
}) satisfies RequestHandler;
