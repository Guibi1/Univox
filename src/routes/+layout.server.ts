import colorScheme, { type ColorScheme } from "$lib/stores/colorScheme";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;

    // Stores are up to date during SSR
    colorScheme.setInitial(color);

    // Data available throughout the site
    return {
        stores: {
            colorScheme: color,
        },
    };
}) satisfies LayoutServerLoad;
