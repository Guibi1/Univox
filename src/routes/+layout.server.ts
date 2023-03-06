import type { ColorScheme } from "$lib/stores/colorScheme";
import colorScheme from "$lib/stores/colorScheme";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies, locals }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;

    // Stores are up to date during SSR
    user.set(locals.user);
    colorScheme.setInitial(color);

    // Data available throughout the site
    return {
        storesInitialValue: {
            colorScheme: color,
            serializedUser: JSON.stringify(locals.user),
        },
    };
}) satisfies LayoutServerLoad;
