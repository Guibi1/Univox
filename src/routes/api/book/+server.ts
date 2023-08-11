import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _deleteSchema = z.object({
    bookId: z.string().length(20),
});

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({ success: await db.deleteBookListing(locals.user, data.bookId) });
}) satisfies RequestHandler;
