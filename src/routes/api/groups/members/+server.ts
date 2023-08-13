import * as db from "$lib/server/db";
import { groupIdSchema } from "$lib/zod_schemas";
import { error, json } from "@sveltejs/kit";
import type { User } from "lucia";
import { apiValidate } from "sveltekit-api-fetch/server";
import type { RequestHandler } from "./$types";

export const POST = (async ({ locals, request }) => {
    const { data } = await apiValidate(request, { groupId: groupIdSchema });

    const group = await db.getGroup(data.groupId);
    if (!group || group.usersId.every((id) => locals.user.userId !== id)) {
        throw error(400, "Invalid data.");
    }

    const members: User[] = [];
    for (const id of group.usersId) {
        if (locals.user.userId === id) continue;
        const user = await db.getUser(id);
        if (user) members.push(user);
    }

    return json({ success: true, members });
}) satisfies RequestHandler;
