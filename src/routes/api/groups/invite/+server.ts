/**
 * @file API endpoints to manage friend groups
 */
import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { Types, isObjectIdOrHexString } from "mongoose";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const params = z.object({
    groupId: z.string().refine((s) => isObjectIdOrHexString(s)),
    usersId: z
        .array(
            z
                .string()
                .refine((s) => isObjectIdOrHexString(s))
                .transform((s) => new Types.ObjectId(s))
        )
        .min(1),
});

export const POST = (async ({ request, locals }) => {
    const parse = params.safeParse(await request.json());

    if (!parse.success) {
        console.log(parse.error);
        throw error(400, "Invalid data.");
    }

    const group = await db.getGroup(parse.data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addToGroup(locals.user, group, parse.data.usersId) });
}) satisfies RequestHandler;
