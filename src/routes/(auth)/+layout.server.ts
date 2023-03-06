import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals, url }) => {
    const ref = url.searchParams.get("ref");
    if (!!locals.user && url.pathname !== "/deconnexion") {
        throw redirect(307, ref ?? "/");
    }

    return { params: ref ? `?ref=${ref}` : "", storesInitialValue: null };
}) satisfies LayoutServerLoad;
