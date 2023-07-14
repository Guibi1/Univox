/**
 * @file API endpoint to save the user's settings
 */

import * as db from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const _putSchema = z.object({
    firstDayOfTheWeek: z
        .string()
        .regex(
            /Samedi|Dimanche|Lundi/,
            "Invalid start week date. Expected type 'Samedi' | 'Dimanche' | 'Lundi'."
        ),
});

export const PUT = (async ({ locals, request, cookies }) => {
    const { data } = await apiValidate(request, _putSchema);

    // Save the setting
    if (!(await db.setSettings(locals.user, ""))) {
        throw error(500, "Couldn't save the user's settings.");
    }

    cookies.set("firstDayOfTheWeek", data.firstDayOfTheWeek, { path: "/" });

    return json({ success: true });
}) satisfies RequestHandler;
