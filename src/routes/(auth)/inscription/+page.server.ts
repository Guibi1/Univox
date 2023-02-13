import * as db from "$lib/server/db";
import { login } from "$lib/server/omnivox";
import { fail } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const firstName = data.get("firstName");
        const lastName = data.get("lastName");
        const da = data.get("da");
        const omnivoxPassword = data.get("omnivoxPassword");
        const email = data.get("email");
        const password = data.get("password");

        if (!firstName || !lastName || !email || !da || !password || !omnivoxPassword) {
            return fail(400, { da, firstName, lastName, email, missing: true });
        } else if (!email.toString()) {
            // TODO: install yum and check the inputs
            return fail(400, { da, firstName, lastName, email, emailIncorrect: true });
        } else if (await db.findUser({ da })) {
            return fail(400, { da, firstName, lastName, email, daExists: true });
        }

        try {
            await login(da.toString(), omnivoxPassword.toString());
        } catch (e) {
            return fail(401, { da, firstName, lastName, email, omnivoxIncorrect: true });
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
