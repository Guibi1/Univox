import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _postSchema = z.object({
    avatar: z.string(),
});

export const POST = (async ({ locals, request }) => {
    const { data } = await apiValidate(request, _postSchema);

    return json({ success: await db.updateUser(locals.user, { avatar: data.avatar }) });
}) satisfies RequestHandler;
