import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { Actions } from "./$types";

export const actions = {
    addPeriod: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get("name")?.toString();
        const date = data.get("date")?.toString();
        const startTime = data.get("startTime")?.toString();
        const endTime = data.get("endTime")?.toString();

        // Input validation
        const invalidName = !name || !/\w+/.test(name);
        const invalidDate = !date || !/\d{4}-\d{2}-\d{2}/.test(date);
        const invalidStartTime = !startTime || !/\d{2}:\d{2}(:\d{2})?/.test(startTime);
        const invalidEndTime =
            !endTime ||
            !/\d{2}:\d{2}(:\d{2})?/.test(endTime) ||
            !dayjs(startTime, "HH:mm").isBefore(dayjs(endTime, "HH:mm"));

        if (invalidName || invalidDate || invalidStartTime || invalidEndTime) {
            return fail(400, {
                name,
                date,
                startTime,
                endTime,
                invalidName,
                invalidDate,
                invalidStartTime,
                invalidEndTime,
            });
        }

        try {
            await db.addPeriodsToSchedule(locals.user, [
                {
                    name,
                    timeStart: dayjs(date + startTime, "YYYY-MM-DDHH:mm"),
                    timeEnd: dayjs(date + endTime, "YYYY-MM-DDHH:mm"),
                },
            ]);

            // Everything it good!
            return { success: true };
        } catch {
            return fail(500);
        }
    },
    import: async ({ request, locals }) => {
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

            await db.addPeriodsToSchedule(locals.user, schedule);
        } catch (e) {
            return fail(401, { incorrect: true });
        }

        throw redirect(302, "/horaire");
    },
} satisfies Actions;
