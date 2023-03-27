import { error, type RequestHandler } from "@sveltejs/kit";

export const PUT = (async ({ request, cookies }) => {
    const colorScheme = await request.text();

    if (colorScheme != "light" && colorScheme != "dark") {
        throw error(400, "Invalid color scheme. Expected type 'light' | 'dark'.");
    }

    cookies.set("colorScheme", colorScheme, { path: "/" });

    return new Response();
}) satisfies RequestHandler;
