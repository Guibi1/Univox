import * as db from "$lib/server/db";
import { uploadBookImage } from "$lib/server/storageBucket";
import { fail, redirect } from "@sveltejs/kit";
import { randomUUID } from "crypto";
import { Types } from "mongoose";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const title = data.get("title")?.toString();
        const author = data.get("author")?.toString();
        const state = data.get("state")?.toString();
        const price = data.get("price")?.toString();
        const ISBN = data.get("isbn")?.toString();
        const classCode = data.get("classCode")?.toString();

        // Input validation
        const invalidTitle = !title;
        const invalidAuthor = !author;
        const invalidState = !state;
        const invalidPrice = !price || !/^\d{1,3}$/.test(price);
        const invalidISBN = !ISBN || !verifyISBN(ISBN);
        const invalidClassCode = !classCode;
        const invalidImages = !(data.get("image0")?.valueOf() instanceof File);

        if (
            invalidTitle ||
            invalidAuthor ||
            invalidState ||
            invalidPrice ||
            invalidISBN ||
            invalidClassCode ||
            invalidImages
        ) {
            return fail(400, {
                title,
                author,
                state,
                price,
                isbn: ISBN,
                classCode,
                invalidTitle,
                invalidAuthor,
                invalidState,
                invalidPrice,
                invalidISBN,
                invalidClassCode,
                invalidImages,
            });
        }

        const uploads: Promise<boolean>[] = [];
        const images: string[] = [];
        for (let i = 0; ; i++) {
            const image = data.get("image" + i)?.valueOf();

            if (!(image instanceof File)) break;

            const name = randomUUID();
            uploads.push(uploadBookImage(image, name));
            images.push(`/api/images/book/${name}`);
        }

        const book = {
            _id: new Types.ObjectId(),
            code: classCode,
            sellerId: locals.user._id,
            title,
            ISBN,
            src: images,
            author,
            price: +price,
            state,
        };

        await Promise.all(uploads);
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
