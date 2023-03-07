import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ params, locals }) => {
    if (!locals.user) throw error(401);

    return json(await db.searchUsers(locals.user, params.query));
}) satisfies RequestHandler;
