import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ cookies }) => {
    const user = await db.getUserFromToken(cookies.get("token"));
    return json(user);
}) satisfies RequestHandler;
