import { arrayIdToString, objectIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { isObjectIdOrHexString } from "mongoose";

export const load = async ({ locals, url }) => {
    const query = url.searchParams.get("query") ?? "";
    const codes = url.searchParams.getAll("codes");
    const bookId = url.searchParams.get("bookId") ?? "";

    const results = await db.searchBooks(locals.user, query, codes);

    let selectedBook;
    let selectedBookUser;
    if (isObjectIdOrHexString(bookId)) {
        selectedBook = await db.getBook(bookId);

        if (selectedBook?.sellerId) {
            selectedBookUser = await db.getUser(selectedBook.sellerId);
        }
    }

    return {
        query,
        codes,
        bookId,
        searchResults: arrayIdToString(results),
        selectedBook: selectedBook ? objectIdToString(selectedBook) : null,
        selectedBookUser: selectedBookUser ? objectIdToString(selectedBookUser) : null,
    };
};
