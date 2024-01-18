import * as db from "$lib/server/db";
import { groupIdSchema, userIdSchema } from "$lib/zod_schemas";
import { error, json } from "@sveltejs/kit";
import { validate } from "sveltekit-typesafe-api/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { data } = await validate(request, {
        name: z.string().min(3).max(80),
        usersId: z.array(userIdSchema).min(2),
    });

    const friendsId = await db.getFriendsId(locals.user);
    for (const id of data.usersId) {
        if (!friendsId.some((f) => f === id)) {
            throw error(400, "Invalid data.");
        }
    }

    return json({ success: await db.createGroup(locals.user, data.name, data.usersId) });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { data } = await validate(request, { groupId: groupIdSchema });

    return json({ success: await db.quitGroup(locals.user, data.groupId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, groups: await locals.getGroups() });
}) satisfies RequestHandler;
