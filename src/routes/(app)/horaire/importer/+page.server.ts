import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { incorrect: true });

        const data = await request.formData();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();

        if (!omnivoxPassword) {
            return fail(400, { incorrect: true });
        }

        try {
            const cookie = await omnivox.login(locals.user.da, omnivoxPassword);
            const html = await omnivox.fetchSchedulePageHTML(
                cookie,
                dayjs().year(),
                omnivox.Semester.Winter
            );
            const schedule = omnivox.schedulePageToClasses(html);

            await db.addPeriodsToSchedule(locals.user.scheduleId, schedule);
        } catch (e) {
            return fail(401, { incorrect: true });
        }

        throw redirect(302, "/horaire");
    },
} satisfies Actions;
