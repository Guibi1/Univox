import * as db from "$lib/server/db";
import type { NotificationKind } from "$lib/types";
import { serialIdSchema, userIdSchema } from "$lib/zod_schemas";
import { json } from "@sveltejs/kit";
import { validate } from "sveltekit-typesafe-api/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { data } = await validate(request, {
        kind: z.string().transform((k) => k as NotificationKind),
        receiverId: userIdSchema,
    });

    return json({
        success: await db.sendNotification(locals.user, data.receiverId, data.kind),
    });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    const { data } = await validate(request, { notificationId: serialIdSchema });

    return json({ success: await db.deleteNotification(locals.user, data.notificationId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, notifications: await locals.getNotifications() });
}) satisfies RequestHandler;
