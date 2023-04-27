import type { LayoutServerLoad } from "./$types";

export const load = (() => {
    return { storesInitialValue: {} };
}) satisfies LayoutServerLoad;
