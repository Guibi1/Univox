import * as omnivox from "$lib/server/omnivox";
import { error, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
    const { da, password } = await request.json();

    if (!da || da === "" || !password || password === "") {
        throw error(400, "Invalid ");
    }

    try {
        await omnivox.login(da, password);
    } catch (e) {
        throw error(401, "Invalid credentials.");
    }

    return new Response();
}) satisfies RequestHandler;
