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

/**
 * Tests the format and the check digit of an ISBN
 * @param ISBN The ISBN to verify
 * @returns True if valid, false otherwise
 * @author https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch04s13.html
 */
function verifyISBN(ISBN: string) {
    // Test the format
    const regex =
        // /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
        /^(?:ISBN(?:-1[03])?:? )?(?=[-0-9 ]{17}$|[-0-9X ]{13}$|[0-9X]{10}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?(?:[0-9]+[- ]?){2}[0-9X]$/;
    if (!regex.test(ISBN)) {
        return false;
    }

    // Remove non digits
    const chars = ISBN.replace(/[^0-9X]/g, "").split("");
    // Remove the check digit
    const checkDigit = chars.pop();

    let result: string | number = 0;

    // Test the Check Digit
    if (ISBN.length === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += (10 - i) * parseInt(chars[i], 10);
        }

        result = 11 - (sum % 11);
        if (result == 10) {
            result = "X";
        } else if (result == 11) {
            result = 0;
        }
    } else {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += ((i % 2) * 2 + 1) * parseInt(chars[i], 10);
        }
        result = 10 - (sum % 10);
        if (result == 10) {
            result = "0";
        }
    }

    return result == checkDigit;
}
