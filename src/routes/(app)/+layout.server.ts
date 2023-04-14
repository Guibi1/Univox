import { serverUserToUser } from "$lib/server/db";
import friends from "$lib/stores/friends";
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
    friends.set(locals.friends);

    return {
        storesInitialValue: {
            serializedUser: JSON.stringify(serverUserToUser(locals.user)),
            serializedFriends: JSON.stringify(locals.friends),
            serializedNotifications: JSON.stringify(locals.notifications),
            serializedGroups: JSON.stringify(locals.groups),
        },
    };
}) satisfies LayoutServerLoad;
