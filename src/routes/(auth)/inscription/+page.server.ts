import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail } from "@sveltejs/kit";
import { Types } from "mongoose";
import { setError, superValidate } from "sveltekit-superforms/client";
import type { Actions } from "./$types";
import { formSchema } from "./+page.svelte";

export const load = async () => {
    const form = await superValidate(formSchema);
    return { form };
};

export const actions = {
    firstStep: async ({ request }) => {
        const form = await superValidate(request, formSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            // Login via Omnivox to verify the user's identity
            const cookie = await omnivox.login(form.data.email, form.data.omnivoxPassword);
            const html = await omnivox.fetchSchedulePageHTML(cookie, 2023, omnivox.Semester.Winter);
            const info = omnivox.schedulePageToName(html);

            // Make sure the DA doesn't already has an account
            if (await db.findUser({ email: form.data.email })) {
                return setError(form, "email", "Un compte avec ce courriel existe déjà");
            }

            form.data.firstName = info.firstName;

            // Everything it good!
            return { form };
        } catch (e) {
            return setError(form, "omnivoxPassword", "Mot de passe erroné");
        }
    },

    secondStep: async ({ request, cookies }) => {
        const form = await superValidate(request, formSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        // Login via Omnivox to verify the user's identity
        try {
            const cookie = await omnivox.login(form.data.email, form.data.omnivoxPassword);
            const html = await omnivox.fetchSchedulePageHTML(cookie, 2023, omnivox.Semester.Winter);
            const info = omnivox.schedulePageToName(html);

            form.data.firstName = info.firstName;
            form.data.lastName = info.lastName;
        } catch (e) {
            return setError(form, "omnivoxPassword", "Mot de passe erroné");
        }

        // Try to create the user
        const user = await db.createUser(
            {
                _id: new Types.ObjectId(),
                da: form.data.email.split("@")[0],
                email: form.data.email,
                firstName: form.data.firstName,
                lastName: form.data.lastName,
                avatar: form.data.firstName + form.data.email,
            },
            form.data.password
        );

        // Make sure the DA doesn't already has an account
        if (!user) {
            return setError(form, "email", "Un compte avec ce courriel existe déjà");
        }

        // Everything it good!
        const token = await db.createToken(user);
        cookies.set("token", token, { path: "/", httpOnly: true, secure: true, sameSite: true });

        return { form };
    },
} satisfies Actions;
