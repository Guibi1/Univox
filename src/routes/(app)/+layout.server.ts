import { arrayIdToString, objectIdToString } from "$lib/sanitization";
import { serverUserToUser } from "$lib/server/db";
import friends from "$lib/stores/friends";
import groups from "$lib/stores/groups";
import notifications from "$lib/stores/notifications";
import schedule from "$lib/stores/schedule";
import user from "$lib/stores/user";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals, url, depends }) => {
    depends("app:user");
    if (!locals.user) {
        throw redirect(302, `/connexion?ref=${url.pathname}`);
    }

    // Stores are up to date during SSR
    user.set(serverUserToUser(locals.user));
    schedule.set(locals.schedule);
    friends.set(locals.friends);
    groups.set(locals.groups);
    notifications.set(locals.notifications);

    return {
        storesInitialValue: {
            user: objectIdToString(serverUserToUser(locals.user)),
            schedule: objectIdToString(locals.schedule),
            friends: arrayIdToString(locals.friends),
            groups: arrayIdToString(locals.groups),
            notifications: arrayIdToString(locals.notifications),
        },
    };
}) satisfies LayoutServerLoad;
