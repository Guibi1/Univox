import * as db from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import type { Actions } from "./$types";
import { login } from "$lib/server/omnivox";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const da = data.get("da");
        const firstName = data.get("firstName");
        const lastName = data.get("lastName");
        const email = data.get("email");
        const password = data.get("password");

        if (!firstName || !lastName || !email || !da || !password) {
            return fail(400, { da, firstName, lastName, email, missing: true });
        } else if (!email.toString()) {
            // TODO: install yum and check the inputs
            return fail(400, { da, firstName, lastName, email, incorrect: true });
        } else if (await db.findUser({ da })) {
            return fail(400, { firstName, lastName, email, incorrect: true });
        }

        // TODO: Ask for Omnivox info
        // try {
        //     await login(da.toString(), password.toString());
        // } catch (e) {
        //     return fail(401, { da, incorrect: true });
        // }

        await db.createUser({
            da: da.toString(),
            passwordHash: await bcrypt.hash(password.toString(), 11),
            email: email.toString(),
            firstName: firstName.toString(),
            lastName: lastName.toString(),
            scheduleID: new ObjectId(),
        });

        throw redirect(303, "/connexion");
    },
} satisfies Actions;
