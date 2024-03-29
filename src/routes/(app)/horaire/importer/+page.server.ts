import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { omnivoxLoginSchema } from "$lib/zod_schemas";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export async function load() {
    const form = await superValidate(omnivoxLoginSchema);
    return { form };
}

export const actions = {
    import: async ({ request, locals }) => {
        const form = await superValidate(request, omnivoxLoginSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        if (!form.data.session) {
            try {
                const login = await omnivox.login(locals.user.da, locals.user.email, form.data.omnivoxPassword);

                if (login.mfa) {
                    form.data.session = JSON.stringify(login.session.cookies);
                    form.data.mfaId = login.mfa.id;
                    form.message = login.mfa.type;
                    return { form };
                }
            } catch (e) {
                return setError(form, "omnivoxPassword", "Mot de passe omnivox incorrect");
            }
        } else {
            if (!form.data.code) {
                return setError(form, "code", "Champ nécessaire");
            }

            const result = await omnivox.submitCode2FA(
                form.data.code,
                omnivox.createSessionFromCookies(JSON.parse(form.data.session), locals.user.email),
                form.data.mfaId
            );

            form.data.code = undefined;
            if (!result.success) {
                return setError(form, "code", "Code invalide");
            }
        }

        try {
            const html = await omnivox.fetchSchedulePageHTML(
                omnivox.createSessionFromCookies(JSON.parse(form.data.session), locals.user.email),
                2023,
                omnivox.Semester.Winter
            );
            const schedule = await omnivox.schedulePageToClasses(html);

            await db.deleteAllClassesInSchedule(locals.user);
            await db.addClassesToSchedule(locals.user, schedule);
        } catch {
            return setError(
                form,
                "omnivoxPassword",
                "Impossible d'importer votre horaire pour l'instant"
            );
        }

        throw redirect(302, "/horaire");
    },
} satisfies Actions;
