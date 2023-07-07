/**
 * @file API endpoint to save the user's settings
 */

import { error } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _putSchema = z.object({ colorScheme: z.string().regex(/light|dark/) });

/**
 * Updates the user's Color Scheme
 * @param {string} colorScheme The new color scheme
 */
export const PUT = (async ({ request, cookies }) => {
    const { parse } = await apiValidate(request, _putSchema);

    // Input validation
    if (!parse.success) {
        throw error(400, "Invalid color scheme. Expected type 'light' | 'dark'.");
    }

    // Save the setting
    cookies.set("colorScheme", parse.data.colorScheme, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
