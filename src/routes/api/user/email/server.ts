/**
 * @file API endpoint to update the user's avatar
 */

import * as db from "$lib/server/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { email: newEmail } = await request.json();

    // Check if the new email is the same as the old email
    if (locals.user.email === newEmail) {
        throw error(400, "New email cannot be the same as the old email");
    }
    const updatedUser = await db.updateUser(locals.user, { email: newEmail });

    return json({ success: updatedUser !== null, user: updatedUser });
};
