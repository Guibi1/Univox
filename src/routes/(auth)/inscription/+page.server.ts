import * as db from "$lib/server/db";
import * as omnivox from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
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
    secondStep: async ({ request, url }) => {
        const data = await request.formData();
        const da = data.get("da")?.toString();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();

        // Validate first step input
        if (!da || !/\d{7}/.test(da) || !omnivoxPassword) {
            return fail(400, { da, missing: true });
        }

        // Second step data
        const firstName = data.get("firstName")?.toString();
        const lastName = data.get("lastName")?.toString();
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        // Validate second step input
        if (
            !firstName ||
            !/\D{2,}/.test(firstName) ||
            !lastName ||
            !/\D{2,}/.test(lastName) ||
            !password ||
            !/.{8,}/.test(password) ||
            !email ||
            /^[a-zA-Z0-9.+]+@([a-zA-Z0-9]+\.)+[a-zA-Z]+$/i.test(email)
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

        // Login via Omnivox to verify the user's identity
        try {
            await omnivox.login(da, omnivoxPassword);
        } catch (e) {
            return fail(401, { da, omnivoxIncorrect: true });
        }

        // Make sure the DA doesn't already has an account
        if (await db.findUser({ da })) {
            return fail(400, { da, daExists: true });
        }

        // Everything it good!
        await db.createUser({
            _id: new mongoose.Types.ObjectId(),
            da: da,
            passwordHash: await bcryptjs.hash(password ?? "", 11),
            email: email ?? "",
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            scheduleId: new mongoose.Types.ObjectId(),
            friendsId: [],
        });

        throw redirect(302, "/connexion?" + url.searchParams);
    },
} satisfies Actions;
