import { error, json, type RequestHandler } from "@sveltejs/kit";

import { fetchSchedulePageHTML, schedulePageToName, Semester } from "$lib/server/omnivox";

export const POST = (async ({ request, setHeaders }) => {
    const cookie = await request.json();

    try {
        const html = await fetchSchedulePageHTML(cookie, 2023, Semester.Winter);
        const name = schedulePageToName(html);

        setHeaders({ "content-type": "application/json" });
        return json(name);
    } catch (e) {
        throw error(401, "Invalid cookies.");
    }
}) satisfies RequestHandler;
