import type { Handle } from "@sveltejs/kit/types/internal";

export const handle = (async ({ event, resolve }) => {
    const response = await resolve(event);
    const headers = response.headers;
    headers.delete("content-length");

    const colorScheme = event.cookies.get("colorScheme") ?? "dark";
    const body = (await response.text()).replace(
        "%data.colorScheme%",
        `data-colorScheme="${colorScheme}"`
    );

    return new Response(body, {
        ...response,
        headers: headers,
    });
}) satisfies Handle;
