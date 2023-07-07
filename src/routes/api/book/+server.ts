/**
 * @file API endpoints to delete a book
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _deleteSchema = z.object({ bookId: z.string().refine((s) => isObjectIdOrHexString(s)) });

export const DELETE = (async ({ request, locals }) => {
    const { parse } = await apiValidate(request, _deleteSchema);

    if (!parse.success) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.deleteBookListing(locals.user, parse.data.bookId) });
}) satisfies RequestHandler;
