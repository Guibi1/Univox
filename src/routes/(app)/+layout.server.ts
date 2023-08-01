import { scheduleToJson } from "$lib/sanitization";
import friends from "$lib/stores/friends";
import groups from "$lib/stores/groups";
import notifications from "$lib/stores/notifications";
import schedule from "$lib/stores/schedule";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    // Stores are up to date during SSR
    user.set(locals.user);
    notifications.set(await locals.getNotifications());
    schedule.setStore(await locals.getSchedule());
    friends.set(await locals.getFriends());
    groups.set(await locals.getGroups());

    return {
        stores: {
            user: locals.user,
            notifications: await locals.getNotifications(),
            schedule: scheduleToJson(await locals.getSchedule()),
            friends: await locals.getFriends(),
            groups: await locals.getGroups(),
        },
    };
}) satisfies LayoutServerLoad;
