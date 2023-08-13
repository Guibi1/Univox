import * as db from "$lib/server/db";
import { userIdSchema } from "$lib/zod_schemas";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, { friendId: userIdSchema });

    return json({
        success: await db.sendNotification(locals.user, data.friendId, "FriendRequest"),
    });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, { friendId: userIdSchema });

    return json({
        success: await db.deleteFriend(locals.user, data.friendId),
    });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, friends: await locals.getFriends() });
}) satisfies RequestHandler;
