import * as db from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    return {
        bookCodes: await db.getBookCodes(locals.user),
    };
}) satisfies LayoutServerLoad;
