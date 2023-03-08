import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals, url, depends }) => {
    depends("app:user");
    if (!locals.user) {
        throw redirect(307, `/connexion?ref=${url.pathname}`);
    }

    return { storesInitialValue: null };
}) satisfies LayoutServerLoad;
