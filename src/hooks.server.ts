import * as db from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const userLocalsHandle = (async ({ event, resolve }) => {
    const user = await db.getUserFromToken(event.cookies.get("token"));
    if (user) {
        event.locals.user = user;
        event.locals.friends = await db.getFriends(user);
    }
    return resolve(event);
}) satisfies Handle;

const settingsHandle = (async ({ event, resolve }) => {
    if (!event.locals.user) {
        event.cookies.delete("startWeekDate");
        return resolve(event);
    }

    event.cookies.set("colorScheme", "dark");
    event.cookies.set("startWeekDate", "lundi");
    return resolve(event);
}) satisfies Handle;

const colorSchemeHandle = (({ event, resolve }) => {
    const colorScheme = event.cookies.get("colorScheme") ?? "dark";
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%data.colorScheme%", `data-colorScheme="${colorScheme}"`),
    });
}) satisfies Handle;

export const handle = sequence(userLocalsHandle, settingsHandle, colorSchemeHandle);
