import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals, url, depends }) => {
    depends("app:user");
    const ref = url.searchParams.get("ref");
    if (locals.user) {
        throw redirect(302, ref ?? "/");
    }

    return { params: ref ? `?ref=${ref}` : "", storesInitialValue: {} };
}) satisfies LayoutServerLoad;
