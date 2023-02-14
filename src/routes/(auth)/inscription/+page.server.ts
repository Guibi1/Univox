import * as db from "$lib/server/db";
import { login } from "$lib/server/omnivox";
import { fail, redirect } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const firstStep = data.get("firstStep")?.valueOf() == "true";
        const da = data.get("da")?.toString();
        const omnivoxPassword = data.get("omnivoxPassword")?.toString();
        // Second step data
        const firstName = data.get("firstName")?.toString();
        const lastName = data.get("lastName")?.toString();
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();

        // Validate first step input
        if (!da || /\\d{7}/.test(da) || !omnivoxPassword) {
            return fail(400, { da, missing: true });
        }

        // We do the second step first to return faster if there's an error
        if (!firstStep) {
            // Validate second step input
            if (
                !firstName ||
                /\\D{2,}/.test(firstName) ||
                !lastName ||
                /\\D{2,}/.test(lastName) ||
                !password ||
                /.{8,}/.test(password) ||
                !email ||
                /[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+(\\.[a-zA-Z]+)+/.test(email)
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
        }

        // Login via Omnivox to verify the user's identity
        try {
            await login(da, omnivoxPassword);
        } catch (e) {
            return fail(401, { da, omnivoxIncorrect: true });
        }

        // Make sure the DA doesn't already has an account
        if (await db.findUser({ da })) {
            return fail(400, { da, daExists: true });
        }

        // Everything it good!
        if (!firstStep) {
            await db.createUser({
                _id: new mongoose.Types.ObjectId(),
                da: da,
                passwordHash: await bcryptjs.hash(password ?? "", 11),
                email: email ?? "",
                firstName: firstName ?? "",
                lastName: lastName ?? "",
                scheduleId: new mongoose.Types.ObjectId(),
            });

            throw redirect(302, "/connexion");
        }

        return { da, omnivoxPassword, success: true };
    },
} satisfies Actions;
