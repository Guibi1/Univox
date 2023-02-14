import * as db from "$lib/server/db";
import { login } from "$lib/server/omnivox";
import { fail } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import type { Actions } from "./$types";
import validator from "validator";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const firstStep = data.get("firstStep")?.valueOf() == "true";
        const da = data.get("da");
        const omnivoxPassword = data.get("omnivoxPassword");

        if (!da || !omnivoxPassword) {
            return fail(400, { da, missing: true });
        }

        if (firstStep) {
            try {
                await login(da.toString(), omnivoxPassword.toString());
            } catch (e) {
                return fail(401, { da, omnivoxIncorrect: true });
            }

            if (await db.findUser({ da })) {
                return fail(400, { da, daExists: true });
            }

            return { success: true };
        }

        const firstName = data.get("firstName");
        const lastName = data.get("lastName");
        const email = data.get("email");
        const password = data.get("password");

        if (!firstName || !lastName || !email || !password) {
            return fail(400, { da, omnivoxPassword, firstName, lastName, email, missing: true });
        } else if (!validator.isEmail(email.toString())) {
            return fail(400, {
                da,
                omnivoxPassword,
                firstName,
                lastName,
                email,
                emailIncorrect: true,
            });
        } else if (await db.findUser({ da })) {
            return fail(400, { da, omnivoxPassword, firstName, lastName, email, daExists: true });
        }

        await db.createUser({
            _id: new mongoose.Types.ObjectId(),
            da: da.toString(),
            passwordHash: await bcryptjs.hash(password.toString(), 11),
            email: email.toString(),
            firstName: firstName.toString(),
            lastName: lastName.toString(),
            scheduleId: new mongoose.Types.ObjectId(),
        });

        return { success: true };
    },
} satisfies Actions;
