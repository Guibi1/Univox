import * as db from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    return { books: await db.getBooks(locals.user) };
}) satisfies PageServerLoad;
