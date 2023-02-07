import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ cookies }) => {
    const token = cookies.get("token");
    // TODO: signout with database

    cookies.delete("token", { path: "/" });
    return new Response();
}) satisfies RequestHandler;
