import colorScheme, { type ColorScheme } from "$lib/stores/colorScheme";
import startWeekDate, { type FirstDayOfTheWeek } from "$lib/stores/firstDayOfTheWeek";
import friends from "$lib/stores/friends";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies, locals }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;
    const startDate = (cookies.get("startWeekDate") ?? "Dimanche") as FirstDayOfTheWeek;

    // Stores are up to date during SSR
    colorScheme.setInitial(color);
    startWeekDate.setInitial(startDate);
    if (locals.user) {
        user.set(locals.user);
        friends.set(locals.friends);
    }

    // Data available throughout the site
    return {
        storesInitialValue: {
            colorScheme: color,
            startWeekDate: startDate,
        },
    };
}) satisfies LayoutServerLoad;
