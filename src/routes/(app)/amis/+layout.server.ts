import * as db from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals }) => {
    if (!locals.user) throw "";
    return {
        amis: db.getFriends(locals.user),
    };
}) satisfies LayoutServerLoad;
