/**
 * @file API endpoints to delete a book
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ request, locals }) => {
    const { bookId } = await request.json();
    if (!isObjectIdOrHexString(bookId)) {
        throw error(400, "Invalid data.");
    }
    return json({ success: await db.deleteBookListing(locals.user, bookId) });
}) satisfies RequestHandler;
