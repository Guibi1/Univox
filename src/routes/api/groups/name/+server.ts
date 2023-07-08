/**
 * @file API endpoint to update the group's name
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    groupId: z.string().refine((s) => isObjectIdOrHexString(s)),
    name: z.string().min(3),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    const group = await db.getGroup(data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.updateGroup(locals.user, group, { name: data.name }) });
}) satisfies RequestHandler;
