/**
 * @file API endpoint to save the user's settings
 */

import * as db from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _putSchema = z.object({
    firstDayOfTheWeek: z.string().regex(/Samedi|Dimanche|Lundi/),
});

/**
 * Updates the user's first day of the week
 * @param {string} firstDayOfTheWeek The new first day of the week
 */
export const PUT = (async ({ locals, request, cookies }) => {
    const { parse } = await apiValidate(request, _putSchema);

    // Input validation
    if (!parse.success) {
        throw error(400, "Invalid start week date. Expected type 'Samedi' | 'Dimanche' | 'Lundi'.");
    }

    // Save the setting
    if (!(await db.setSettings(locals.user, { firstDayOfTheWeek: parse.data.firstDayOfTheWeek }))) {
        throw error(500, "Couldn't save the user's settings.");
    }

    cookies.set("firstDayOfTheWeek", parse.data.firstDayOfTheWeek, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
