import type { ServerLoadEvent } from "@sveltejs/kit";
import type { ColorScheme } from "$lib/stores/colorScheme";

export function load({ cookies }: ServerLoadEvent) {
    return { colorScheme: (cookies.get("colorScheme") ?? "dark") as ColorScheme };
}
