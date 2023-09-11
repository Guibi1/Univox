import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import type { Actions } from "./$types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParse);

dayjs.tz.setDefault("America/Montreal");

export async function load() {
    const form = await superValidate(newPeriodSchema);
    const day = dayjs();

    form.data.date = day.format("YYYY-MM-DD");
    form.data.startTime = day.add(1, "hour").format("HH:00");
    form.data.endTime = day.add(3, "hour").format("HH:00");

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
        } catch {
            return fail(500, { form });
        }

        return { form };
    },
} satisfies Actions;

const newPeriodSchema = z
    .object({
        name: z.string().min(3, "Requis"),
        date: z.string().regex(/\d\d\d\d-\d\d-\d\d/),
        startTime: z.string().regex(/\d\d:\d\d/),
        endTime: z.string().regex(/\d\d:\d\d/),
    })
    .superRefine(({ startTime, endTime }, { addIssue }) => {
        if (!dayjs(startTime, "HH:MM").isBefore(dayjs(endTime, "HH:MM"), "minutes")) {
            addIssue({
                path: ["endTime"],
                message: "La fin de l'évenement doit être après le début",
                code: "custom",
            });
        }
    });
