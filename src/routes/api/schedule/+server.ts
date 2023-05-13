/**
 * @file API endpoint to add periods to the schedule, fetch the user's schedule, and delete a period
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
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

export const DELETE = (async ({ request, locals }) => {
    const { period } = await request.json();

    // Validate the period object
    if (
        !isObjectIdOrHexString(period._id) ||
        !(period.timeStart instanceof Date) ||
        !(period.timeEnd instanceof Date)
    ) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.deletePeriodById(locals.user, period) });
}) satisfies RequestHandler;
