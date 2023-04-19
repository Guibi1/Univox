import * as db from "$lib/server/db";
import { Types, isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
    const id = url.searchParams.get("id");
    if (!id || !isObjectIdOrHexString(id)) return;

    const bookId = new Types.ObjectId(id);
    return { book: await db.getBook(bookId) };
}) satisfies PageServerLoad;
