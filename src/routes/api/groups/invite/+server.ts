/**
 * @file API endpoints to manage friend groups
 */
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { Types, isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    groupId: z.string().refine((s) => isObjectIdOrHexString(s)),
    usersId: z
        .array(
            z
                .string()
                .refine((s) => isObjectIdOrHexString(s))
                .transform((s) => new Types.ObjectId(s))
        )
        .min(1),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    const group = await db.getGroup(data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addToGroup(locals.user, group, data.usersId) });
}) satisfies RequestHandler;
