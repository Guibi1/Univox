/**
 * @file API endpoints to delete a book
 */

import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { Types, isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _deleteSchema = z.object({
    bookId: z
        .string()
        .refine((s) => isObjectIdOrHexString(s))
        .transform((s) => new Types.ObjectId(s)),
});

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({ success: await db.deleteBookListing(locals.user, data.bookId) });
}) satisfies RequestHandler;
