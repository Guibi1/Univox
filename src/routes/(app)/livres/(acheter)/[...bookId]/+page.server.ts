import * as db from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const bookId = Number.parseInt(params.bookId);

    if (isNaN(bookId)) {
        throw redirect(302, "/livres/");
    }

    const book = await db.getBook(bookId);
    if (!book) {
        throw redirect(302, "/livres/");
    }

    return {
        book: book,
        bookUser: book ? db.getUser(book.userId) : null,
    };
}) satisfies PageServerLoad;
