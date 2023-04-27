/**
 * @file API endpoint to get the current user's data
 */

import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Returns the current user
 */
export const GET = (async ({ locals }) => {
    return json({ success: true, user: db.serverUserToUser(locals.user) });
}) satisfies RequestHandler;
