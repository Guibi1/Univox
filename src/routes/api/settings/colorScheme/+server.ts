import { error, type RequestHandler } from "@sveltejs/kit";

export const PUT = (async ({ request, cookies }) => {
    const text = await request.text();

    if (text != "light" && text != "dark") {
        throw error(400, "Invalid color scheme. Expected type 'light' | 'dark'.");
    }

    cookies.set("colorScheme", text, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
