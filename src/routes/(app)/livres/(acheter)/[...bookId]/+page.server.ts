import { getSchool } from "$lib/getSchool";
import * as db from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const book = await db.getBook(params.bookId);
    if (!book) {
        throw redirect(302, "/livres/");
    }

    const bookUser = db.getUser(book.userId);

    return {
        book: book,
        bookUser: await bookUser,
        school: await bookUser.then((u) => (u ? getSchool(u) : null)),
    };
}) satisfies PageServerLoad;
