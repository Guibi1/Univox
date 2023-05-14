import { arrayIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, depends }) => {
    depends("books");
    return { books: arrayIdToString(await db.getBooks(locals.user)) };
}) satisfies PageServerLoad;
