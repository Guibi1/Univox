import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    friendId: z.string().length(15),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    return json({
        success: await db.addFriend(locals.user, data.friendId),
    });
}) satisfies RequestHandler;

const _deleteSchema = z.object({
    friendId: z.string().length(15),
});

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({
        success: await db.deleteFriend(locals.user, data.friendId),
    });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, friends: locals.getFriends() });
}) satisfies RequestHandler;
