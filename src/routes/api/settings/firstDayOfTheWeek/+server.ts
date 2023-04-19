/**
 * @file API endpoint to save the user's settings
 */

import * as db from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Updates the user's first day of the week
 * @param {string} firstDayOfTheWeek The new first day of the week
 */
export const PUT = (async ({ locals, request, cookies }) => {
    if (!locals.user) throw error(401);

    const firstDayOfTheWeek = await request.text();

    // Input validation
    if (
        firstDayOfTheWeek !== "Samedi" &&
        firstDayOfTheWeek !== "Dimanche" &&
        firstDayOfTheWeek !== "Lundi"
    ) {
        throw error(400, "Invalid start week date. Expected type 'Samedi' | 'Dimanche' | 'Lundi'.");
    }

    // Save the setting
    if (!(await db.setSettings(locals.user, { firstDayOfTheWeek }))) {
        throw error(500, "Couldn't save the user's settings.");
    }

    cookies.set("firstDayOfTheWeek", firstDayOfTheWeek, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
