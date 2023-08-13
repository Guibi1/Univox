import * as db from "$lib/server/db";
import { bookIdSchema } from "$lib/zod_schemas";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, { bookId: bookIdSchema });

    return json({ success: await db.deleteBookListing(locals.user, data.bookId) });
}) satisfies RequestHandler;
