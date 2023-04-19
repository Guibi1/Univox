/**
 * @file API endpoint to search for books
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// TODO: Change to a GET
export const POST = (async ({ locals, request, params }) => {
    if (!locals.user) throw error(401);

    const { codes } = await request.json();

    // Input validation
    if (!Array.isArray(codes)) throw error(400);

    return json(await db.searchBooks(locals.user, params.query, codes));
}) satisfies RequestHandler;
