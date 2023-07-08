/**
 * @file API endpoints to manage the friends
 */

import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { Types, isObjectIdOrHexString } from "mongoose";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    friendId: z
        .string()
        .refine((s) => isObjectIdOrHexString(s))
        .transform((s) => new Types.ObjectId(s)),
});

/**
 * Adds a friend to the user's friendlist
 * @param {Types.ObjectId} friendId The user to befriend
 */
export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    return json({
        success: await db.addFriend(locals.user, data.friendId),
    });
}) satisfies RequestHandler;

const _deleteSchema = z.object({
    friendId: z
        .string()
        .refine((s) => isObjectIdOrHexString(s))
        .transform((s) => new Types.ObjectId(s)),
});

/**
 * Removes a friend from the user's friendlist
 * @param {Types.ObjectId} friendId The user to unfriend
 */
export const DELETE = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _deleteSchema);

    return json({
        success: await db.deleteFriend(locals.user, data.friendId),
    });
}) satisfies RequestHandler;

/**
 * Returns an up to date array of friends
 */
export const GET = (async ({ locals }) => {
    return json({ success: true, friends: locals.friends });
}) satisfies RequestHandler;
