import { error, type RequestHandler } from "@sveltejs/kit";

export const PUT = (async ({ request, cookies }) => {
    const text = await request.text();

    if (text != "Samedi" && text != "Dimanche" && text != "Lundi") {
        throw error(400, "Invalid color scheme. Expected type 'light' | 'dark'.");
    }

    cookies.set("startWeekDate", text, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
