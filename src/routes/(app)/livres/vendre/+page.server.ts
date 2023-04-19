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
        const invalidISBN = !ISBN;
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
