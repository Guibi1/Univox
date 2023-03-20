import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./[query]/$types";

export const GET = (async ({ locals, request }) => {
    if (!locals.user) throw error(401);

    const { query, filter } = await request.json();
    if (typeof query != "string" || !Array.isArray(filter)) throw error(400);

    return json(await db.searchBooks(locals.user, query, filter));
}) satisfies RequestHandler;
