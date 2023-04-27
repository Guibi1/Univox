/**
 * @file API endpoint to update the user's avatar
 */

import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * @param {string} avatar The avatar's generation seed
 */
export const POST = (async ({ locals, request }) => {
    const avatar = await request.text();

    return json({ success: await db.updateUser(locals.user, { avatar }) });
}) satisfies RequestHandler;
