/**
 * @file API endpoint to search for books
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ locals, request }) => {
    const { query, codes } = await request.json();

    // Input validation
    if (typeof query !== "string" || !Array.isArray(codes)) {
        throw error(400);
    }

    return json(await db.searchBooks(locals.user, query, codes));
}) satisfies RequestHandler;
