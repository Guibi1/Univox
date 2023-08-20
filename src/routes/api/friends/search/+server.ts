import * as db from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { apiValidate } from "sveltekit-api-fetch/server";
import { z } from "zod";
import type { RequestHandler } from "../$types";

export const GET = (async ({ locals, url }) => {
    const { data } = await apiValidate(url, { searchParams: z.object({ query: z.string() }) });

    const results = [];

    const users = await db.searchUsers(locals.user, data.searchParams.query);
    if (users.length > 0) {
        results.push({ users, otherSchool: false });
    }

    const otherSchoolUsers = await db.searchUsers(locals.user, data.searchParams.query, 5, false);
    if (otherSchoolUsers.length > 0) {
        results.push({ users: otherSchoolUsers, otherSchool: true });
    }

    return json(results);
}) satisfies RequestHandler;
