/**
 * @file API endpoint to search for users
 */

import type { User } from "$lib/Types";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Returns data about some users that matched with the query
 */
export const GET = (async ({ params, locals }) => {
    if (!locals.user) throw error(401);

    const result: { user: User; friendRequestSent: boolean }[] = [];

    const users = await db.searchUsers(locals.user, params.query);
    for (const user of users) {
        const friendRequestSent = await db.friendRequestExists(locals.user, user);
        result.push({ user: db.serverUserToUser(user), friendRequestSent });
    }

    return json(result);
}) satisfies RequestHandler;
