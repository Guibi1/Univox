import * as db from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
    const query = url.searchParams.get("query") ?? "";
    const selectedCodes = url.searchParams.getAll("codes");

    return {
        streamed: {
            books: db.searchBooks(locals.user, query, selectedCodes),
        },
    };
}) satisfies LayoutServerLoad;
