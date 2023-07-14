import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    groupId: z.number(),
    name: z.string().min(3),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    const group = await db.getGroup(data.groupId);
    if (!group) {
        return json({ success: false });
    }

    return json({ success: await db.updateGroup(locals.user, group, { name: data.name }) });
}) satisfies RequestHandler;
