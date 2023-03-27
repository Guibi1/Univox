import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail } from "@sveltejs/kit";
import mongoose from "mongoose";
import type { Actions } from "./$types";

export const actions = {
    firstStep: async ({ request }) => {
        const data = await request.formData();
        const da = data.get("da")?.toString();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();

        // Validate first step input
        if (!da || !/\d{7}/.test(da) || !omnivoxPassword) {
            return fail(400, { da, missing: true });
        }

        try {
            // Login via Omnivox to verify the user's identity
            const cookie = await omnivox.login(da, omnivoxPassword);
            const html = await omnivox.fetchSchedulePageHTML(cookie, 2023, omnivox.Semester.Winter);
            const info = omnivox.schedulePageToName(html);

            // Make sure the DA doesn't already has an account
            if (await db.findUser({ da })) {
                return fail(400, { da, daExists: true });
            }

            // Everything it good!
            return { da, omnivoxPassword, ...info, success: true };
        } catch (e) {
            return fail(401, { da, omnivoxIncorrect: true });
        }
    },

    secondStep: async ({ request, cookies }) => {
        const data = await request.formData();
        const da = data.get("da")?.toString();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();

        // Validate first step input
        if (!da || !/\d{7}/.test(da) || !omnivoxPassword) {
            return fail(400, { da, missing: true });
        }

        // Second step data
        let firstName = data.get("firstName")?.toString();
        let lastName = data.get("lastName")?.toString();
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        // Validate second step input
        if (
            !password ||
            !/^.{8,}$/.test(password) ||
            !email ||
            !/^[a-zA-Z0-9.+]+@([a-zA-Z0-9]+\.)+[a-zA-Z]+$/.test(email)
        ) {
            return fail(400, {
                da,
                omnivoxPassword,
                firstName,
                lastName,
                email,
                missing: true,
            });
        }

        // Login via Omnivox to verify the user's identity
        try {
            const cookie = await omnivox.login(da, omnivoxPassword);
            const html = await omnivox.fetchSchedulePageHTML(cookie, 2023, omnivox.Semester.Winter);
            const info = omnivox.schedulePageToName(html);
            firstName = info.firstName;
            lastName = info.lastName;
        } catch (e) {
            return fail(401, { da, omnivoxIncorrect: true });
        }

        // Make sure the DA doesn't already has an account
        if (await db.findUser({ da })) {
            return fail(400, {
                da,
                omnivoxPassword,
                firstName,
                lastName,
                email,
                emailExists: true,
            });
        }

        // Everything it good!
        const user = {
            _id: new mongoose.Types.ObjectId(),
            da: da,
            email: email ?? "",
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            scheduleId: new mongoose.Types.ObjectId(),
            settingsId: new mongoose.Types.ObjectId(),
            friendsId: [],
        };

        await db.createUser(user, password);
        const token = await db.createToken(user);

        cookies.set("token", token, { path: "/", httpOnly: true, secure: true, sameSite: true });

        return { success: true };
    },
} satisfies Actions;
