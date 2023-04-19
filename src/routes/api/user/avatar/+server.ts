/**
 * @file API endpoint to update the user's avatar
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * @param {string} avatar The avatar's generation seed
 */
export const POST = (async ({ locals, request }) => {
    if (!locals.user) throw error(401);

    const avatar = await request.text();

    return json({ success: await db.updateUser(locals.user, { avatar }) });
}) satisfies RequestHandler;
