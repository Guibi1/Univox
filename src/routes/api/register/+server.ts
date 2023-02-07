import { error, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request, cookies }) => {
    const data = await request.formData();
    const fname = data.get("fname");
    const lname = data.get("lname");
    const email = data.get("email");
    const da = data.get("da");
    const password = data.get("password");

    if (!fname || !lname || !email || !da || !password) {
        throw error(400, "Invalid data.");
    }

    // TODO: register with database
    const token = "";
    if (!token) {
        throw error(401, "Invalid credentials");
    }

    cookies.set("token", token, { path: "/", httpOnly: true });
    return new Response();
}) satisfies RequestHandler;
