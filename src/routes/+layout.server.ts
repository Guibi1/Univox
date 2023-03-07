import type { ColorScheme } from "$lib/stores/colorScheme";
import colorScheme from "$lib/stores/colorScheme";
import friends from "$lib/stores/friends";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies, locals }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;

    // Stores are up to date during SSR
    colorScheme.setInitial(color);
    user.set(locals.user);
    friends.set(locals.friends);

    // Data available throughout the site
    return {
        storesInitialValue: {
            colorScheme: color,
            serializedUser: JSON.stringify(locals.user),
            serializedFriends: JSON.stringify(locals.friends),
        },
    };
}) satisfies LayoutServerLoad;
