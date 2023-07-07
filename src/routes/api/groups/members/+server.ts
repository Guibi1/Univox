/**
 * @file API endpoints to manage friend groups
 */
import type { User } from "$lib/Types";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    groupId: z.string().refine((s) => isObjectIdOrHexString(s)),
});

export const POST = (async ({ locals, request }) => {
    const { parse } = await apiValidate(request, _postSchema);

    if (!parse.success) {
        throw error(400, "Invalid data.");
    }

    const group = await db.getGroup(parse.data.groupId);
    if (!group || group.usersId.every((id) => !locals.user._id.equals(id))) {
        throw error(400, "Invalid data.");
    }

    const members: User[] = [];
    for (const id of group.usersId) {
        if (locals.user._id.equals(id)) continue;
        const user = await db.findUser(id);
        if (user) members.push(user);
    }

    return json({ success: true, members });
}) satisfies RequestHandler;
