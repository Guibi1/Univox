import { importScheduleSchema } from "$lib/formSchema";
import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export async function load() {
    const form = await superValidate(importScheduleSchema);
    return { form };
}

export const actions = {
    import: async ({ request, locals }) => {
        const form = await superValidate(request, importScheduleSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const cookie = await omnivox.login(locals.user.email, form.data.omnivoxPassword);
            const html = await omnivox.fetchSchedulePageHTML(
                cookie,
                dayjs().year(),
                omnivox.Semester.Winter
            );
            const schedule = await omnivox.schedulePageToClasses(html);

            await db.addClassesToSchedule(locals.user, schedule);
        } catch {
            return setError(form, "omnivoxPassword", "Mot de passe erroné");
        }

        throw redirect(302, "/horaire");
    },
} satisfies Actions;
