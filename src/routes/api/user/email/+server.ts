/**
 * @file API endpoint to update the user's avatar
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

async function emailExists(email: string) {
    const user = await db.findUser({ email: email });
    return user !== null;
}

export const POST = (async ({ request, locals }) => {
    const newEmail = await request.text();

    // Check if the new email is the same as the old email
    if (locals.user.email === newEmail) {
        throw error(400, "New email cannot be the same as the old email");
    }

    if (await emailExists(newEmail)) {
        throw error(400, "The new email is already in use");
    }

    const updatedUser = await db.updateUser(locals.user, { email: newEmail });

    return json({ success: updatedUser !== null, user: updatedUser });
}) satisfies RequestHandler;
