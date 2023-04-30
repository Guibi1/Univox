import { imageSchema, newBookSchema } from "$lib/formSchema";
import * as db from "$lib/server/db";
import { uploadBookImage } from "$lib/server/storageBucket";
import { fail, redirect } from "@sveltejs/kit";
import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export async function load() {
    const form = await superValidate(newBookSchema);
    return { form };
}

export const actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, newBookSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        const images: File[] = [];

        for (let i = 0; ; i++) {
            const data = formData.get("image" + i)?.valueOf();

            if (!(data instanceof File)) {
                if (images.length === 0) {
                    return setError(
                        form,
                        "images",
                        "Il faut au moins une image pour afficher un livre"
                    );
                } else {
                    break;
                }
            }

            const result = imageSchema.safeParse(data);
            if (result.success) {
                images.push(result.data);
            } else {
                return setError(form, "images", result.error.errors[0].message);
            }
        }

        const uploads: Promise<boolean>[] = [];
        const imagesSrc: string[] = [];
        for (const image of images) {
            const name = randomUUID();
            uploads.push(uploadBookImage(image, name));
            imagesSrc.push(`/api/images/book/${name}`);
        }

        const book = {
            _id: new Types.ObjectId(),
            sellerId: locals.user._id,
            title: form.data.title,
            author: form.data.author,
            state: form.data.state,
            price: form.data.price,
            ISBN: form.data.ISBN,
            code: form.data.classCode,
            src: imagesSrc,
        };

        await Promise.allSettled(uploads);
        await db.addBookListing(book);

        throw redirect(302, "/livres/mes-livres");
    },
} satisfies Actions;
