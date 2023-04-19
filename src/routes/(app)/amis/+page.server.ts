import * as db from "$lib/server/db";
import { Types, isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
    const id = url.searchParams.get("id");
    console.log("🚀 ~ file: +page.server.ts:7 ~ load ~ id:", id);
    if (!id || !isObjectIdOrHexString(id)) return;

    const userId = new Types.ObjectId(id);
    if (!locals.user.friendsId.includes(userId)) return;

    const user = await db.getServerUser(userId);
    if (!user) return;

    return { schedule: await db.getSchedule(user) };
}) satisfies PageServerLoad;
