/**
 * @file API endpoints to manage friend groups
 */

import { arrayIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    usersId: z.array(z.string().refine((s) => isObjectIdOrHexString(s))).min(2),
});

export const POST = (async ({ request, locals }) => {
    const { parse } = await apiValidate(request, _postSchema);

    if (!parse.success) {
        throw error(400, "Invalid data.");
    }

    for (const id of parse.data.usersId) {
        if (!locals.user.friendsId.some((u) => u._id.equals(id))) {
            throw error(400, "Invalid data.");
        }
    }

    return json({ success: await db.createGroup(locals.user, parse.data.usersId) });
}) satisfies RequestHandler;

const _deleteSchema = z.object({ groupId: z.string().refine((s) => isObjectIdOrHexString(s)) });

export const DELETE = (async ({ request, locals }) => {
    const { parse } = await apiValidate(request, _deleteSchema);

    if (!parse.success) {
        throw error(400, "Invalid data.");
    }

    const group = await db.getGroup(parse.data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.quitGroup(locals.user, group) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json(arrayIdToString(locals.groups));
}) satisfies RequestHandler;
