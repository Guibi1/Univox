import { newPasswordSchema } from "$lib/formSchema";
import schoolNames from "$lib/schoolNames";
import { auth } from "$lib/server/auth.js";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

export async function load({ locals }) {
    const form = await superValidate(newPasswordSchema);
    const domain = locals.user.email.split("@")[1];

    return { form, schoolName: schoolNames.get(domain) ?? domain };
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
