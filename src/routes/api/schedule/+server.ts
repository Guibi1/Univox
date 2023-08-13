import * as db from "$lib/server/db";
import { periodSchema, serialIdSchema } from "$lib/zod_schemas";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, { period: periodSchema });

    return json({ success: await db.addPeriodsToSchedule(locals.user, [data.period]) });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, { periodId: serialIdSchema });

    return json({ success: await db.deletePeriodFromSchedule(locals.user, data.periodId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, schedule: await locals.getSchedule() });
}) satisfies RequestHandler;
