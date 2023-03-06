import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals }) => {
    if (locals.user) {
        throw redirect(307, "/");
    }

    return { storesInitialValue: null };
}) satisfies LayoutServerLoad;
