import * as db from "$lib/server/db";
import { error, type RequestHandler } from "@sveltejs/kit";

export const PUT = (async ({ locals, request, cookies }) => {
    if (!locals.user) throw error(401);

    const firstDayOfTheWeek = await request.text();

    if (
        firstDayOfTheWeek != "Samedi" &&
        firstDayOfTheWeek != "Dimanche" &&
        firstDayOfTheWeek != "Lundi"
    ) {
        throw error(400, "Invalid start week date. Expected type 'Samedi' | 'Dimanche' | 'Lundi'.");
    }

    if (!(await db.setSettings(locals.user, { firstDayOfTheWeek }))) {
        throw error(500, "Couldn't save the user's settings.");
    }

    cookies.set("firstDayOfTheWeek", firstDayOfTheWeek, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
