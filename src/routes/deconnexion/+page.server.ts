import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const { session } = await locals.auth.validateUser();
    if (session) {
        await auth.invalidateSession(session.sessionId);
        locals.auth.setSession(null);
    }

    throw redirect(307, "/connexion");
}) satisfies PageServerLoad;
