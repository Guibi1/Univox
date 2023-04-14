import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ locals, request }) => {
    if (!locals.user) throw error(401);

    const avatar = await request.text();

    return json({
        success: await db.updateUser(locals.user, { avatar }),
    });
}) satisfies RequestHandler;
