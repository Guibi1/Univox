import * as db from "$lib/server/db";
import { groupIdSchema, userIdSchema } from "$lib/zod_schemas";
import { error, json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, {
        groupId: groupIdSchema,
        usersId: z.array(userIdSchema).min(1),
    });

    const group = await db.getGroup(data.groupId);
    if (!group) {
        throw error(400, "Invalid data.");
    }

    return json({ success: await db.addToGroup(locals.user, group, data.usersId) });
}) satisfies RequestHandler;
