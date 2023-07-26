import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    usersId: z.array(z.string().length(15)).min(2),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    for (const id of data.usersId) {
        const friendsId = await db.getFriendsId(locals.user);
        if (!friendsId.some((f) => f === id)) {
            throw error(400, "Invalid data.");
        }
    }

    return json({ success: await db.createGroup(locals.user, data.usersId) });
}) satisfies RequestHandler;

const _deleteSchema = z.object({ groupId: z.number() });

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({ success: await db.quitGroup(locals.user, data.groupId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json(locals.getGroups());
}) satisfies RequestHandler;
