import * as db from "$lib/server/db";
import { isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
    const id = url.searchParams.get("id");
    if (!id || !isObjectIdOrHexString(id)) return;

    return { book: await db.getBook(id) };
}) satisfies PageServerLoad;
