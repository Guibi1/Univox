/**
 * @file API endpoint to save the user's settings
 */

import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Updates the user's Color Scheme
 * @param {string} colorScheme The new color scheme
 */
export const PUT = (async ({ request, cookies }) => {
    const colorScheme = await request.text();

    // Input validation
    if (colorScheme !== "light" && colorScheme !== "dark") {
        throw error(400, "Invalid color scheme. Expected type 'light' | 'dark'.");
    }

    // Save the setting
    cookies.set("colorScheme", colorScheme, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
