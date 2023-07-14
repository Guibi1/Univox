import friends from "$lib/stores/friends";
import groups from "$lib/stores/groups";
import notifications from "$lib/stores/notifications";
import schedule from "$lib/stores/schedule";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals }) => {
    // Stores are up to date during SSR
    user.set(locals.user);
    schedule.set(locals.schedule);
    friends.set(locals.friends);
    groups.set(locals.groups);
    notifications.set(locals.notifications);

    return {
        storesInitialValue: {
            user: locals.user,
            schedule: locals.schedule,
            friends: locals.friends,
            groups: locals.groups,
            notifications: locals.notifications,
        },
    };
}) satisfies LayoutServerLoad;
