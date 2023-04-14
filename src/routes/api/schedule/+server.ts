import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { periods } = await request.json();
    if (!periods || periods.length === 0) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addPeriodsToSchedule(locals.user, periods) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);
    return json(locals);
}) satisfies RequestHandler;
