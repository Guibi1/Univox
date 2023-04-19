/**
 * @file API endpoint to get a user's info
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Returns the requested user
 */
export const GET = (async ({ locals, params }) => {
    if (!locals.user) throw error(401);

    const user = await db.findUser({ _id: params.id });

    return json({ success: !!user, user });
}) satisfies RequestHandler;
