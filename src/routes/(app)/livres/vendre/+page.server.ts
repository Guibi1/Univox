import { uploadBookCover } from "$lib/server/bucket";
import * as db from "$lib/server/db";
import { imageSchema } from "$lib/zod_schemas";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
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

        let src = "";
        const imageData = formData.get("image")?.valueOf();
        if (imageData) {
            const imageParse = imageSchema.safeParse(imageData);
            if (imageParse.success) {
                src = await uploadBookCover(imageParse.data);
            } else {
                return setError(form, "images", imageParse.error.errors[0].message);
            }
        }

        const book = {
            userId: locals.user.userId,
            title: form.data.title,
            author: form.data.author,
            state: form.data.state,
            price: form.data.price,
            isbn: form.data.isbn,
            code: form.data.classCode,
            image: src,
        };

        await db.addBookListing(locals.user, book);

        throw redirect(302, "/livres/mes-livres");
    },
} satisfies Actions;

const newBookSchema = z.object({
    title: z.string().min(1, "Requis"),
    author: z.string().min(1, "Requis"),
    state: z.string().min(1, "Requis"),
    price: z.number().min(0, "Le prix doit être positif").max(300, "Le prix doit être sous 300 $"),
    classCode: z.string().min(1, "Requis"),
    images: z.string().optional(),
    isbn: z
        .string()
        .min(1, "L'ISBN est requis")
        .regex(
            /(?:ISBN(?:-1[03])?:? )?(?=[-0-9 ]{17}$|[-0-9X ]{13}$|[0-9X]{10}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?(?:[0-9]+[- ]?){2}[0-9X]/,
            "Format invalide"
        )
        .refine((ISBN) => {
            /**
             * Tests the format and the check digit of an ISBN
             * @param ISBN The ISBN to verify
             * @author https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch04s13.html
             */

            // Remove non digits
            const chars = ISBN.replace(/[^0-9X]/g, "").split("");
            const checkDigit = chars.pop();

            let result: string | number = 0;
            let sum = 0;

            // Test the Check Digit
            if (ISBN.length === 10) {
                for (let i = 0; i < 9; i++) {
                    sum += (10 - i) * parseInt(chars[i], 10);
                }
                result = 11 - (sum % 11);
                if (result == 10) result = "X";
                else if (result == 11) result = 0;
            } else {
                let sum = 0;
                for (let i = 0; i < 12; i++) {
                    sum += ((i % 2) * 2 + 1) * parseInt(chars[i], 10);
                }
                result = 10 - (sum % 10);
                if (result == 10) result = "0";
            }

            return result == checkDigit;
        }, "L'ISBN n'exsite pas"),
});
