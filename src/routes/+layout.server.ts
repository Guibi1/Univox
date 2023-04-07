import colorScheme, { type ColorScheme } from "$lib/stores/colorScheme";
import firstDayOfTheWeek, { type FirstDayOfTheWeek } from "$lib/stores/firstDayOfTheWeek";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;
    const firstDay = (cookies.get("firstDayOfTheWeek") ?? "Dimanche") as FirstDayOfTheWeek;

    // Stores are up to date during SSR
    colorScheme.setInitial(color);
    firstDayOfTheWeek.setInitial(firstDay);

    // Data available throughout the site
    return {
        storesInitialValue: {
            colorScheme: color,
            firstDayOfTheWeek: firstDay,
        },
    };
}) satisfies LayoutServerLoad;
