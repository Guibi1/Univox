/**
 * @file API endpoints to manage friend groups
 */
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { User } from "lucia-auth";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    groupId: z.number(),
});

export const POST = (async ({ locals, request }) => {
    const { data } = await apiValidate(request, _postSchema);

    const group = await db.getGroup(data.groupId);
    if (!group || group.usersId.every((id) => locals.user.id !== id)) {
        throw error(400, "Invalid data.");
    }

    const members: User[] = [];
    for (const id of group.usersId) {
        if (locals.user.id === id) continue;
        const user = await db.getUser(id);
        if (user) members.push(user);
    }

    return json({ success: true, members });
}) satisfies RequestHandler;
