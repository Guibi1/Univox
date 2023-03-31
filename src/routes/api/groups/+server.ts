import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { groupId } = await request.json();
    if (!groupId) {
        throw error(400, "Invalid data.");
    }

    const { friendId } = await request.json(); //Pas sûr de ça
    if (!friendId) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addToGroup(locals.user, groupId, friendId) });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { groupId } = await request.json();
    if (!groupId) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.quitGroup(locals.user, groupId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);
    return json(locals.groups);
}) satisfies RequestHandler;
