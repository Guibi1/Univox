import { arrayIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { usersId } = await request.json();

    if (!Array.isArray(usersId) || usersId.length < 2) {
        throw error(400, "Invalid data.");
    }

    for (const id of usersId) {
        if (!isObjectIdOrHexString(id) || !locals.user.friendsId.includes(id)) {
            throw error(400, "Invalid data.");
        }
    }

    return json({ success: await db.createGroup(locals.user, usersId) });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { groupId } = await request.json();
    if (!isObjectIdOrHexString(groupId)) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.quitGroup(locals.user, groupId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json(arrayIdToString(locals.groups));
}) satisfies RequestHandler;
