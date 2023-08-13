import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ locals, request }) => {
    const { data } = await apiValidate(request, { avatar: z.string().min(6) });

    return json({ success: await db.updateUser(locals.user, { avatar: data.avatar }) });
}) satisfies RequestHandler;
