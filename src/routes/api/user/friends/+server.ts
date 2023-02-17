import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { User } from "$lib/Types";

export const POST = (async ({ request, cookies }) => {
    const { friendId } = await request.json();

    if (!friendId) {
        throw error(400, "Invalid data.");
    }

    const userId = await db.getUserIdFromToken(cookies.get("token"));
    if (!userId) {
        throw error(401);
    }

    await db.addFriend(userId, friendId);
    return new Response();
}) satisfies RequestHandler;

export const GET = (async ({ cookies }) => {
    const userId = await db.getUserIdFromToken(cookies.get("token"));
    if (!userId) {
        throw error(401);
    }

    const friends = await db.getFriends(userId);
    if (!friends) {
        throw error(418, "Try to login again.");
    }

    return json(friends);
}) satisfies RequestHandler;
