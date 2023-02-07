import { login } from "$lib/server/omnivox";
import { error, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
    const data = await request.formData();
    const da = data.get("da")?.toString();
    const password = data.get("password")?.toString();
    const newPassword = data.get("newPassword")?.toString();

    if (!da || !password || !newPassword) {
        throw error(400, "Invalid data.");
    }

    try {
        await login(da, password);
    } catch (e) {
        throw error(401, "Invalid credentials.");
    }

    // TODO: reset password with database
    return new Response();
}) satisfies RequestHandler;
