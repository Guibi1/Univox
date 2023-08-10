import { auth } from "$lib/server/lucia";
import * as db from "$lib/server/db";
import type { Group, Notification, Schedule } from "$lib/types";
import { fail, redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { User } from "lucia";

const localsHandle = (async ({ event, resolve }) => {
    event.locals.auth = auth.handleRequest(event);
    const { user } = await event.locals.auth.validate() ?? {};

    if (user) {
        event.locals.user = user;

        let schedule: Schedule | undefined;
        event.locals.getSchedule = async (refresh = false) => {
            if (!schedule || refresh) schedule = await db.getSchedule(user);
            return schedule;
        };

        let friends: User[] | undefined;
        event.locals.getFriends = async (refresh = false) => {
            if (!friends || refresh) friends = await db.getFriends(user);
            return friends;
        };

        let groups: Group[] | undefined;
        event.locals.getGroups = async (refresh = false) => {
            if (!groups || refresh) groups = await db.getGroups(user);
            return groups;
        };

        let notifications: Notification[] | undefined;
        event.locals.getNotifications = async (refresh = false) => {
            if (!notifications || refresh) notifications = await db.getNotifications(user);
            return notifications;
        };
    }

    return resolve(event);
}) satisfies Handle;

const redirectHandle = (async ({ event, resolve }) => {
    if (event.locals.user) {
        if (event.route.id?.startsWith("/(auth)")) {
            throw redirect(302, event.url.searchParams.get("ref") ?? `/`);
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

const colorSchemeHandle = (({ event, resolve }) => {
    const colorScheme = event.cookies.get("colorScheme") ?? "dark";
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace("%data.colorScheme%", `class="${colorScheme}"`),
    });
}) satisfies Handle;

export const handle = sequence(localsHandle, redirectHandle, colorSchemeHandle);
