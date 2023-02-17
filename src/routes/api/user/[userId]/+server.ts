import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import mongoose from "mongoose";
import type { RequestHandler } from "./$types";

export const GET = (async ({ cookies, params }) => {
    const userId = new mongoose.Types.ObjectId(params.userId);
    const currentUser = await db.getUserFromToken(cookies.get("token"));
    if (!currentUser?.friends.includes(userId)) {
        throw error(403);
    }

    return json(await db.findUserById(userId));
}) satisfies RequestHandler;
