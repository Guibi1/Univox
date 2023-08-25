import { deleteBookCover } from "$lib/server/bucket";
import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ locals, params }) => {
    const book = await db.getBook(params.bookId);
    if (book?.image) deleteBookCover(book.image);

    return json({ success: await db.deleteBookListing(locals.user, params.bookId) });
}) satisfies RequestHandler;

export const GET = (async ({ params }) => {
    const book = await db.getBook(params.bookId);

    return json({ success: !!book, book: book });
}) satisfies RequestHandler;
