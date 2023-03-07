import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);
    return json(locals.user);
}) satisfies RequestHandler;
