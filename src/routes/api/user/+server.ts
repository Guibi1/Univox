import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals }) => {
    return json(locals.user);
}) satisfies RequestHandler;
