import * as db from "$lib/server/db";
import type { NotificationKind } from "$lib/types";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    kind: z.string().transform((k) => k as NotificationKind),
    receiverId: z.string().length(15),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    return json({
        success: await db.sendNotification(locals.user, data.receiverId, data.kind),
    });
}) satisfies RequestHandler;

const _deleteSchema = z.object({
    notificationId: z.number(),
});

export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({ success: await db.deleteNotification(locals.user, data.notificationId) });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    return json({ success: true, notifications: await locals.getNotifications() });
}) satisfies RequestHandler;
