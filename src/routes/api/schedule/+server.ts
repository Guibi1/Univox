/**
 * @file API endpoint to add periods to the schedule, fetch the user's schedule, and delete a period
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { Types, isObjectIdOrHexString } from "mongoose";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { periods } = await request.json();

    if (!Array.isArray(periods) || periods.length === 0) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addPeriodsToSchedule(locals.user, periods) });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { period } = await request.json();

    const result = z
        .object({
            name: z.string().min(1),
            _id: z
                .string()
                .refine((s) => isObjectIdOrHexString(s))
                .transform((s) => new Types.ObjectId(s)),
            timeStart: z
                .string()
                .datetime()
                .transform((d) => dayjs(d)),
            timeEnd: z
                .string()
                .datetime()
                .transform((d) => dayjs(d)),
        })
        .safeParse(period);

    // Validate the period object
    if (!result.success) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.deletePeriodFromSchedule(locals.user, result.data) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, schedule: locals.schedule });
}) satisfies RequestHandler;
