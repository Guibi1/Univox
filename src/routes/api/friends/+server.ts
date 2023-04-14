import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { friendId } = await request.json();
    if (!friendId) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.addFriend(locals.user, friendId),
    });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { friendId } = await request.json();
    if (!friendId) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.deleteFriend(locals.user, friendId),
    });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);
    return json({ success: true, friends: locals.friends });
}) satisfies RequestHandler;
