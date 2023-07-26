/**
 * @file API endpoint to save the user's settings
 */

import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _putSchema = z.object({ colorScheme: z.string().regex(/light|dark/) });

/**
 * Updates the user's Color Scheme
 * @param {string} colorScheme The new color scheme
 */
export const PUT = (async ({ request, cookies }) => {
    const { data } = await apiValidate(request, _putSchema);

    cookies.set("colorScheme", data.colorScheme, { path: "/" });

    return json({ success: true });
}) satisfies RequestHandler;
