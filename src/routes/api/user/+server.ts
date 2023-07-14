import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Returns the current user
 */
export const GET = (async ({ locals }) => {
    return json({ success: true, user: locals.user });
}) satisfies RequestHandler;
