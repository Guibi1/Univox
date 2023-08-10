import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    return json({ success: await db.addPeriodsToSchedule(locals.user, data.periods) });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({ success: await db.deletePeriodFromSchedule(locals.user, data.period) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, schedule: await locals.getSchedule() });
}) satisfies RequestHandler;

const period = z.object({
    id: z.number(),
    name: z.string().min(1),
    timeStart: z
        .string()
        .datetime()
        .transform((d) => dayjs(d)),
    timeEnd: z
        .string()
        .datetime()
        .transform((d) => dayjs(d)),
});

const _postSchema = z.object({
    periods: z.array(period).min(1),
});

const _deleteSchema = z.object({
    period,
});
