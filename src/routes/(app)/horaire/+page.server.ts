import { newPeriodSchema } from "$lib/formSchema";
import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/Montreal");

export async function load() {
    const form = await superValidate(newPeriodSchema);
    form.data.date = dayjs().format("YYYY-MM-DD");
    form.data.startTime = dayjs().add(1, "hour").format("HH:00");
    form.data.endTime = dayjs().add(3, "hour").format("HH:00");
    return { form };
}

export const actions = {
    addPeriod: async ({ request, locals }) => {
        const form = await superValidate(request, newPeriodSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await db.addPeriodsToSchedule(locals.user, [
                {
                    name: form.data.name,
                    timeStart: dayjs(form.data.date + form.data.startTime, "YYYY-MM-DDHH:mm"),
                    timeEnd: dayjs(form.data.date + form.data.endTime, "YYYY-MM-DDHH:mm"),
                },
            ]);

            // Everything is good!
            return { form };
        } catch {
            return fail(500, { form });
        }
    },
} satisfies Actions;
