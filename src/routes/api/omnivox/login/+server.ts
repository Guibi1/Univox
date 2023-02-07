import { error, type RequestHandler } from "@sveltejs/kit";

import { login } from "$lib/server/omnivox";

export const POST = (async ({ request }) => {
    const data = await request.json();

    if (!data.da || data.da === "" || !data.password || data.password === "") {
        throw error(400, "Invalid data.");
    }

    try {
        await login(data.da, data.password);
    } catch (e) {
        throw error(401, "Invalid credentials.");
    }

    return new Response();
}) satisfies RequestHandler;
