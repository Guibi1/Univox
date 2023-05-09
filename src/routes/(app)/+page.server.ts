import { arrayIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    return { books: arrayIdToString(await db.getBooks(locals.user)) };
}) satisfies PageServerLoad;
