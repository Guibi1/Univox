/**
 * @file API endpoints to manage the friends
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { isObjectIdOrHexString } from "mongoose";
import type { RequestHandler } from "./$types";

/**
 * Adds a friend to the user's friendlist
 * @param {Types.ObjectId} friendId The user to befriend
 */
export const POST = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { friendId } = await request.json();

    // Input validation
    if (!isObjectIdOrHexString(friendId)) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.addFriend(locals.user, friendId),
    });
}) satisfies RequestHandler;

/**
 * Removes a friend from the user's friendlist
 * @param {Types.ObjectId} friendId The user to unfriend
 */
export const DELETE = (async ({ request, locals }) => {
    if (!locals.user) throw error(401);

    const { friendId } = await request.json();

    // Input validation
    if (!isObjectIdOrHexString(friendId)) {
        throw error(400, "Invalid data.");
    }

    return json({
        success: await db.deleteFriend(locals.user, friendId),
    });
}) satisfies RequestHandler;

/**
 * Returns an up to date array of friends
 */
export const GET = (async ({ locals }) => {
    if (!locals.user) throw error(401);

    return json({ success: true, friends: locals.friends });
}) satisfies RequestHandler;
