import * as db from "$lib/server/db";
import { Semester, fetchSchedule, login } from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();

        if (!omnivoxPassword) {
            return fail(400, { incorrect: true });
        }

        const user = await db.getUserFromToken(cookies.get("token"));
        if (!user) {
            return fail(401, { incorrect: true });
        }

        try {
            const schedule = await fetchSchedule(
                await login(user.da, omnivoxPassword),
                dayjs().year(),
                Semester.Winter
            );

            await db.addPeriodsToSchedule(user.scheduleId, schedule);
        } catch (e) {
            return fail(401, { incorrect: true });
        }

        throw redirect(302, "/horaire");
    },
} satisfies Actions;
