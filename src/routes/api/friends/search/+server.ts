import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch";
import { z } from "zod";
import type { RequestHandler } from "../$types";

const _postSchema = z.object({
    searchQuery: z.string().min(0),
});

export const POST = (async ({ request, locals }) => {
    const { data } = await apiValidate(request, _postSchema);

    const results = [];

    const users = await db.searchUsers(locals.user, data.searchQuery);
    if (users.length > 0) {
        results.push({ users, otherSchool: false });
    }

    const otherSchoolUsers = await db.searchUsers(locals.user, data.searchQuery, 5, false);
    if (otherSchoolUsers.length > 0) {
        results.push({ users: otherSchoolUsers, otherSchool: true });
    }

    return json(results);
}) satisfies RequestHandler;
