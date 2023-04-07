import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals, params }) => {
    if (!locals.user) throw error(401);

    const user = await db.findUser({ _id: params.id });
    if (!user) {
        return json(null);
    }
    return json(db.serverUserToUser(user));
}) satisfies RequestHandler;
