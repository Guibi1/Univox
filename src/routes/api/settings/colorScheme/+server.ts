import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const PUT = (async ({ request, cookies }) => {
    const { data } = await apiValidate(request, { colorScheme: z.string().regex(/light|dark/) });

    cookies.set("colorScheme", data.colorScheme, { path: "/" });
    return json({ success: true });
}) satisfies RequestHandler;
