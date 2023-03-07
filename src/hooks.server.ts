import * as db from "$lib/server/db";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit/types/internal";

const userLocalsHandle = (async ({ event, resolve }) => {
    const user = await db.getUserFromToken(event.cookies.get("token"));
    if (user) {
        event.locals.user = user;
        event.locals.friends = await db.getFriends(user);
    } else {
        event.locals.user = null;
        event.locals.friends = [];
    }
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
