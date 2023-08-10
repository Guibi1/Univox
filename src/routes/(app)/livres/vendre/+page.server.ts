import { imageSchema, newBookSchema } from "$lib/formSchema";
import * as db from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import { randomUUID } from "crypto";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const form = await superValidate(newBookSchema);
    return { form, codes: [...(await db.getClassCodes(locals.user)), "Autres"] };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, newBookSchema);

        if (
            !form.valid ||
            !(
                form.data.classCode === "Autres" ||
                (await db.getClassCodes(locals.user)).includes(form.data.classCode)
            )
        ) {
            return fail(400, { form });
        }

        const images: File[] = [];
        for (let i = 0; ; i++) {
            const data = formData.get("image" + i)?.valueOf();
            if (!(data instanceof File)) break;

            const result = imageSchema.safeParse(data);
            if (result.success) {
                images.push(result.data);
            } else {
                return setError(form, "images", result.error.errors[0].message);
            }
        }

        if (images.length === 0) {
            return setError(form, "images", "Il faut au moins une image pour afficher un livre");
        }

        const uploads: Promise<boolean>[] = [];
        const imagesSrc: string[] = [];
        for (const image of images) {
            const name = randomUUID();
            // uploads.push(uploadBookImage(image, name));
            imagesSrc.push(`/api/images/book/${name + image}`);
        }

        const book = {
            userId: locals.user.userId,
            title: form.data.title,
            author: form.data.author,
            state: form.data.state,
            price: form.data.price,
            isbn: form.data.isbn,
            code: form.data.classCode,
            image: "",
        };

        await Promise.allSettled(uploads);
        await db.addBookListing(locals.user, book);

        throw redirect(302, "/livres/mes-livres");
    },
} satisfies Actions;
