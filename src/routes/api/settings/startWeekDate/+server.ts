import { error, type RequestHandler } from "@sveltejs/kit";

export const PUT = (async ({ request, cookies }) => {
    const text = await request.text();

    if (text != "Samedi" && text != "Dimanche" && text != "Lundi") {
        throw error(400, "Invalid start week date. Expected type 'Samedi' | 'Dimanche' | 'Lundi'.");
    }

    cookies.set("startWeekDate", text, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
