/**
 * @file API endpoints to manage friend groups
 */
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    groupId: z.number(),
    usersId: z.array(z.string()).min(1),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    const group = await db.getGroup(data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addToGroup(locals.user, group, data.usersId) });
}) satisfies RequestHandler;
