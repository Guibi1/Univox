import colorScheme, { type ColorScheme } from "$lib/stores/colorScheme";
import friends from "$lib/stores/friends";
import startWeekDate, { type StartWeekDate } from "$lib/stores/startWeekDate";
import user from "$lib/stores/user";
import type { LayoutServerLoad } from "./$types";

export const load = (({ cookies, locals }) => {
    const color = (cookies.get("colorScheme") ?? "dark") as ColorScheme;
    const startDate = (cookies.get("startWeekDate") ?? "Dimanche") as StartWeekDate;

    // Stores are up to date during SSR
    colorScheme.setInitial(color);
    startWeekDate.setInitial(startDate);
    user.set(locals.user);
    friends.set(locals.friends);

    // Data available throughout the site
    return {
        storesInitialValue: {
            colorScheme: color,
            startWeekDate: startDate,
            serializedUser: JSON.stringify(locals.user),
            serializedFriends: JSON.stringify(locals.friends),
        },
    };
}) satisfies LayoutServerLoad;
