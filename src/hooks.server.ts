import * as db from "$lib/server/db";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit/types/internal";

const userLocalsHandle = (async ({ event, resolve }) => {
    event.locals.user = await db.getUserFromToken(event.cookies.get("token"));
    return resolve(event);
}) satisfies Handle;

const colorSchemeHandle = (async ({ event, resolve }) => {
    const colorScheme = event.cookies.get("colorScheme") ?? "dark";
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%data.colorScheme%", `data-colorScheme="${colorScheme}"`),
    });
}) satisfies Handle;

export const handle = sequence(userLocalsHandle, colorSchemeHandle);
