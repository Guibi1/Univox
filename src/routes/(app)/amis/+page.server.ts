import type { User } from "$lib/Types";
import { arrayIdToString, objectIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url, depends }) => {
    depends("app:notifications");

    const query = url.searchParams.get("query") ?? "";
    const friendId = url.searchParams.get("friendId") ?? "";

    let friend;
    if (
        isObjectIdOrHexString(friendId) &&
        locals.user.friendsId.some((id) => id.equals(friendId))
    ) {
        friend = await db.getServerUser(friendId);
    }

    const result: { user: User; friendRequestSent: boolean }[] = [];

    const users = await db.searchUsers(locals.user, query);
    for (const user of users) {
        const friendRequestSent = await db.friendRequestExists(locals.user, user);
        result.push({ user: db.serverUserToUser(user), friendRequestSent });
    }

    return {
        query,
        friendId,
        schedule: friend ? objectIdToString(await db.getSchedule(friend)) : null,
        searchResults: arrayIdToString(result),
    };
}) satisfies PageServerLoad;
