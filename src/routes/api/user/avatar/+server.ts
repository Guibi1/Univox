/**
 * @file API endpoint to update the user's avatar
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    avatar: z.string(),
});

/**
 * @param {string} avatar The avatar's generation seed
 */
export const POST = (async ({ locals, request }) => {
    const { parse } = await apiValidate(request, _postSchema);

    if (!parse.success) {
        throw error(400, "Invalid data");
    }

    return json({ success: await db.updateUser(locals.user, { avatar: parse.data.avatar }) });
}) satisfies RequestHandler;
