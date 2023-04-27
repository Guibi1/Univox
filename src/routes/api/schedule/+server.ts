import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { periods } = await request.json();

    if (!Array.isArray(periods) || periods.length === 0) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addPeriodsToSchedule(locals.user, periods) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, schedule: locals.schedule });
}) satisfies RequestHandler;
