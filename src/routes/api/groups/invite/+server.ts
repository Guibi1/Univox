/**
 * @file API endpoints to manage friend groups
 */
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { groupId, usersId } = await request.json();

    if (!isObjectIdOrHexString(groupId) || usersId.length < 1) {
        throw error(400, "Invalid data.");
    }
    const group = await db.getGroup(groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addToGroup(locals.user, group, usersId) });
}) satisfies RequestHandler;
