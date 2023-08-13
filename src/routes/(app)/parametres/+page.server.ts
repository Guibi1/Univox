import { getSchool } from "$lib/getSchool";
import { auth } from "$lib/server/lucia.js";
import { passwordSchema } from "$lib/zod_schemas.js";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

export async function load({ locals }) {
    const form = await superValidate(newPasswordSchema);

    return { form, school: getSchool(locals.user) };
}

export const actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, newPasswordSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        auth.updateKeyPassword("email", locals.user.da, form.data.password);

        throw redirect(302, "/");
    },
};

const newPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .superRefine(({ confirmPassword, password }, { addIssue }) => {
        if (confirmPassword !== password) {
            addIssue({
                path: ["confirmPassword"],
                message: "Les mots de passe correspondent pas",
                code: "custom",
            });
        }
    });
