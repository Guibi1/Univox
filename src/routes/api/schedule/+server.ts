/**
 * @file API endpoint to add periods to the schedule, fetch the user's schedule, and delete a period
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { Types, isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    periods: z
        .array(
            z.object({
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
        )
        .min(1),
});

export const POST = (async ({ request, locals }) => {
    const { parse } = await apiValidate(request, _postSchema);

    if (!parse.success) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addPeriodsToSchedule(locals.user, parse.data.periods) });
}) satisfies RequestHandler;

const _deleteSchema = z.object({
    period: z.object({
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
    }),
});

export const DELETE = (async ({ request, locals }) => {
    const { parse } = await apiValidate(request, _deleteSchema);

    // Validate the period object
    if (!parse.success) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.deletePeriodFromSchedule(locals.user, parse.data.period) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, schedule: locals.schedule });
}) satisfies RequestHandler;
