import * as db from "$lib/server/db";
import type { ColorScheme } from "$lib/stores/colorScheme";
import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ cookies }: ServerLoadEvent) {
    return {
        colorScheme: (cookies.get("colorScheme") ?? "dark") as ColorScheme,
        currentUser: JSON.stringify(await db.getUserFromToken(cookies.get("token"))),
    };
}
