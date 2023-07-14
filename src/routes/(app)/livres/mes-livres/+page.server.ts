import * as db from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, depends }) => {
    depends("books");
    return { books: await db.getBooks(locals.user) };
}) satisfies PageServerLoad;
