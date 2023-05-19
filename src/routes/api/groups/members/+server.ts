/**
 * @file API endpoints to manage friend groups
 */
import type { User } from "$lib/Types";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

export const GET = (async ({ request }) => {
    const { groupId } = await request.json();
    if (!isObjectIdOrHexString(groupId)) {
        throw error(400, "Invalid data.");
    }

    const group = await db.getGroup(groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    const members: User[] = [];

    for (let index = 0; index < group.usersId.length; index++) {
        const user = await db.findUser(group.usersId[index]);

        if (user) {
            members.push(user);
        }
    }

    return json({ members });
}) satisfies RequestHandler;
