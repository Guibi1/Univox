import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { validate } from "sveltekit-typesafe-api/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals, url }) => {
    const { data } = await validate(url, {
        searchParams: z.object({
            query: z.string(),
            codes: z.string(),
            page: z.string().transform((s) => Number.parseInt(s)),
        }),
    });

    const books = await db.searchBooks(
        locals.user,
        data.searchParams.query,
        [data.searchParams.codes],
        data.searchParams.page,
        20
    );

    return json({ success: true, books: books });
}) satisfies RequestHandler;
