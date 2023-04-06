import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals, url, depends }) => {
    depends("app:user");
    if (!locals.user) {
        throw redirect(302, `/connexion?ref=${url.pathname}`);
    }

    return {
        storesInitialValue: {
            serializedUser: JSON.stringify(locals.user),
            serializedFriends: JSON.stringify(locals.friends),
            serializedNotifications: JSON.stringify(locals.notifications),
        },
    };
}) satisfies LayoutServerLoad;
