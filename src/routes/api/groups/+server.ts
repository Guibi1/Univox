/**
 * @file API endpoints to manage friend groups
 */

import { arrayIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { Types, isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    usersId: z
        .array(
            z
                .string()
                .refine((s) => isObjectIdOrHexString(s))
                .transform((s) => new Types.ObjectId(s))
        )
        .min(2),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    for (const id of data.usersId) {
        if (!locals.user.friendsId.some((u) => u._id.equals(id))) {
            throw error(400, "Invalid data.");
        }
    }

    return json({ success: await db.createGroup(locals.user, data.usersId) });
}) satisfies RequestHandler;

const _deleteSchema = z.object({ groupId: z.string().refine((s) => isObjectIdOrHexString(s)) });

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    const group = await db.getGroup(data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.quitGroup(locals.user, group) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json(arrayIdToString(locals.groups));
}) satisfies RequestHandler;
