import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import mongoose from "mongoose";
import type { RequestHandler } from "./$types";

export const GET = (async ({ params, locals }) => {
    if (!locals.user) throw error(401);

    const userId = new mongoose.Types.ObjectId(params.userId);
    if (!locals.user.friends.includes(userId)) {
        throw error(403);
    }

    return json(await db.findUserById(userId));
}) satisfies RequestHandler;
