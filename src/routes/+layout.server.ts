import colorScheme, { type ColorScheme } from "$lib/stores/colorScheme";
import firstDayOfTheWeek, { type FirstDayOfTheWeek } from "$lib/stores/firstDayOfTheWeek";
import friends from "$lib/stores/friends";
import groups from "$lib/stores/groups";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies, locals }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;
    const firstDay = (cookies.get("firstDayOfTheWeek") ?? "Dimanche") as FirstDayOfTheWeek;

    // Stores are up to date during SSR
    colorScheme.setInitial(color);
    firstDayOfTheWeek.setInitial(firstDay);
    if (locals.user) {
        user.set(locals.user);
        friends.set(locals.friends);
        groups.set(locals.groups);
    }

    // Data available throughout the site
    return {
        storesInitialValue: {
            colorScheme: color,
            firstDayOfTheWeek: firstDay,
        },
    };
}) satisfies LayoutServerLoad;
