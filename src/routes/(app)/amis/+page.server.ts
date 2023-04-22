import { objectIdToString } from "$lib/sanitization";
import * as db from "$lib/server/db";
import { isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
    const userId = url.searchParams.get("id");
    if (!userId || !isObjectIdOrHexString(userId)) return;
    if (!locals.user.friendsId.some((id) => id.equals(userId))) return;

    const user = await db.getServerUser(userId);
    if (!user) return;

    return { schedule: objectIdToString(await db.getSchedule(user)) };
}) satisfies PageServerLoad;
