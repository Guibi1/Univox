import { getSchool } from "$lib/getSchool";
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

    const bookUser = db.getUser(book.userId);

    return {
        book: book,
        bookUser,
        school: await bookUser.then((u) => (u ? getSchool(u) : null)),
    };
}) satisfies PageServerLoad;
