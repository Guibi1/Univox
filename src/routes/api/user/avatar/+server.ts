import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { validate } from "sveltekit-typesafe-api/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const POST = (async ({ locals, request }) => {
    const { data } = await validate(request, { avatar: z.string().min(6) });

    return json({ success: await db.updateUser(locals.user, { avatar: data.avatar }) });
}) satisfies RequestHandler;
