import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import mongoose from "mongoose";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { kind, receiverId } = await request.json();
    if (!kind || !receiverId || !(await db.getUser(receiverId))) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.sendNotification(
            locals.user,
            { _id: new mongoose.Types.ObjectId(), kind, senderId: locals.user._id },
            receiverId
        ),
        notifications: await db.getNotifications(locals.user),
    });
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { notification } = await request.json();
    if (!notification) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.deleteNotification(locals.user, notification),
        notifications: await db.getNotifications(locals.user),
    });
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);
    return json({ success: true, notifications: locals.notifications });
}) satisfies RequestHandler;
