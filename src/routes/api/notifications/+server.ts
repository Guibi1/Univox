/**
 * @file API endpoints to manage the notifications
 */

import { NotificationKind } from "$lib/Types";
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

/**
 * Sends a notification to a user
 * @param {NotificationKind} kind The kind of notification
 * @param {Types.ObjectId} receiverId The user that will receive the notification
 */
export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { kind, receiverId } = await request.json();

    // Input validation
    if (
        typeof kind !== "string" ||
        !(kind in NotificationKind) ||
        !isObjectIdOrHexString(receiverId)
    ) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.sendNotification(locals.user, kind as NotificationKind, receiverId),
    });
}) satisfies RequestHandler;

/**
 * Removes a notification from the user's account
 * @param {Types.ObjectId} notificationId The ID of the notification to remove
 */
export const DELETE = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { notificationId } = await request.json();

    // Input validation
    if (!isObjectIdOrHexString(notificationId)) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.deleteNotification(locals.user, notificationId) });
}) satisfies RequestHandler;

/**
 * Returns an up to date array of notifications
 */
export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);

    return json({ success: true, notifications: locals.notifications });
}) satisfies RequestHandler;
