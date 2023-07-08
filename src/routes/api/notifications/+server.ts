/**
 * @file API endpoints to manage the notifications
 */

import { NotificationKind } from "$lib/Types";
import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    kind: z.string().refine((s) => s in NotificationKind),
    receiverId: z.string().refine((s) => isObjectIdOrHexString(s)),
});

/**
 * Sends a notification to a user
 * @param {NotificationKind} kind The kind of notification
 * @param {Types.ObjectId} receiverId The user that will receive the notification
 */
export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    return json({
        success: await db.sendNotification(
            locals.user,
            data.kind as NotificationKind,
            data.receiverId
        ),
    });
}) satisfies RequestHandler;

const _deleteSchema = z.object({
    notificationId: z.string().refine((s) => isObjectIdOrHexString(s)),
});

/**
 * Removes a notification from the user's account
 * @param {Types.ObjectId} notificationId The ID of the notification to remove
 */
export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({ success: await db.deleteNotification(locals.user, data.notificationId) });
}) satisfies RequestHandler;

/**
 * Returns an up to date array of notifications
 */
export const GET = (async ({ locals }) => {
    return json({ success: true, notifications: locals.notifications });
}) satisfies RequestHandler;
