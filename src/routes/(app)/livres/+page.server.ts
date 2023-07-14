import * as db from "$lib/server/db";

export const load = async ({ locals, url }) => {
    const query = url.searchParams.get("query") ?? "";
    const selectedCodes = url.searchParams.getAll("codes");
    const bookId = Number.parseInt(url.searchParams.get("bookId") ?? "");

    const results = await db.searchBooks(locals.user, query, selectedCodes);

    let selectedBook;
    let selectedBookUser;
    if (bookId) {
        selectedBook = await db.getBook(bookId);

        if (selectedBook?.userId) {
            selectedBookUser = await db.getUser(selectedBook.userId);
        }
    }

    return {
        bookCodes: await db.getBookCodes(locals.user),
        query,
        selectedCodes,
        bookId,
        searchResults: results,
        selectedBook: selectedBook,
        selectedBookUser: selectedBookUser,
    };
};
