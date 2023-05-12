/**
 * @file API endpoint to update the group's name
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { groupId, name } = await request.json();

    if (!isObjectIdOrHexString(groupId) || typeof name !== "string" || name.length < 3) {
        throw error(400, "Invalid data.");
    }

    const group = await db.getGroup(groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.updateGroup(locals.user, group, { name }) });
}) satisfies RequestHandler;
