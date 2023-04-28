import { arrayIdToString, objectIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
    const id = url.searchParams.get("id");
    let book;
    if (id && isObjectIdOrHexString(id)) book = await db.getBook(id);

    return {
        books: arrayIdToString(await db.searchBooks(locals.user, "", [])),
        book: book ? objectIdToString(book) : null,
    };
}) satisfies PageServerLoad;
