import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { friendId } = await request.json();
    if (!friendId) {
        throw error(400, "Invalid data.");
    }

    await db.addFriend(locals.user, friendId);
    return new Response();
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);

    const friends = await db.getFriends(locals.user);
    if (!friends) {
        throw error(418, "Try to login again.");
    }

    return json(friends);
}) satisfies RequestHandler;
