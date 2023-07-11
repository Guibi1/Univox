import * as db from "$lib/server/db";
import { auth } from "$lib/server/lucia";
import { fail, redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const userLocalsHandle = (async ({ event, resolve }) => {
    event.locals.auth = auth.handleRequest(event);
    const { user } = await event.locals.auth.validateUser();

    const uuu = false;
    if (uuu) {
        if (event.route.id?.startsWith("/(auth)")) {
            throw redirect(302, event.url.searchParams.get("ref") ?? `/`);
        } else {
            event.locals.user = uuu;
            event.locals.schedule = await db.getSchedule(uuu);
            event.locals.friends = await db.getFriends(uuu);
            event.locals.groups = await db.getGroups(uuu);
            event.locals.notifications = await db.getNotifications(uuu);
        }
    } else if (event.route.id?.startsWith("/(app)")) {
        throw redirect(302, `/connexion?ref=${event.url.pathname}`);
    } else if (
        event.route.id?.startsWith("/api") &&
        event.route.id !== "/api/settings/colorScheme"
    ) {
        throw fail(401);
    }

    return resolve(event);
}) satisfies Handle;

const settingsHandle = (async ({ event, resolve }) => {
    if (event.locals.user) {
        event.cookies.set(
            "firstDayOfTheWeek",
            (await db.getSettings(event.locals.user))?.firstDayOfTheWeek ?? "Dimanche",
            { path: "/" }
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
