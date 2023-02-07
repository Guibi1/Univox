import type { Handle } from "@sveltejs/kit/types/internal";

export const handle = (async ({ event, resolve }) => {
    const response = await resolve(event);
    if (response.headers.get("content-type") !== "text/html") {
        return response;
    }

    // If its an HTML page
    const headers = response.headers;
    headers.delete("content-length");

    const colorScheme = event.cookies.get("colorScheme") ?? "dark";
    const body = (await response.text()).replace(
        "%data.colorScheme%",
        `data-colorScheme="${colorScheme}"`
    );

    return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
    });
}) satisfies Handle;
