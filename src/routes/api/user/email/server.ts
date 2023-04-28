/**
 * @file API endpoint to update the user's avatar
 */

import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const newEmail = await request.text();

    const updatedUser = await db.updateUser(locals.user, { email: newEmail });

    return json({ success: updatedUser !== null, user: updatedUser });
}) satisfies RequestHandler;
