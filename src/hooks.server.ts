import * as db from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const userLocalsHandle = (async ({ event, resolve }) => {
    const user = await db.getUserFromToken(event.cookies.get("token"));
    if (user) {
        event.locals.user = user;
        event.locals.friends = await db.getFriends(user);
        event.locals.notifications = await db.getNotifications(user);
    }

    return resolve(event);
}) satisfies Handle;

const settingsHandle = (async ({ event, resolve }) => {
    if (event.locals.user) {
        event.cookies.set(
            "firstDayOfTheWeek",
            (await db.getSettings(event.locals.user))?.firstDayOfTheWeek ?? "Dimanche"
        );
    } else {
        event.cookies.delete("firstDayOfTheWeek");
    }

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
