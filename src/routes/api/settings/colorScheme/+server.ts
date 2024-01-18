import { json } from "@sveltejs/kit";
import { validate } from "sveltekit-typesafe-api/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const PUT = (async ({ request, cookies }) => {
    const { data } = await validate(request, { colorScheme: z.string().regex(/light|dark/) });

    cookies.set("colorScheme", data.colorScheme, { path: "/" });
    return json({ success: true });
}) satisfies RequestHandler;
