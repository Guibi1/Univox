import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

import { fetchSchedule, login, Semester } from "$lib/server/omnivox";

export const POST = (async ({ request, setHeaders }) => {
    const data = await request.json();

    const cookie = await login(data.da, data.password);
    const schedule = await fetchSchedule(cookie, 2023, Semester.Winter);

    setHeaders({ "content-type": "application/json" });
    return json(schedule);
}) satisfies RequestHandler;
