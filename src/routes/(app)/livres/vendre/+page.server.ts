import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import mongoose from "mongoose";
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
        const images = data.get("images")?.toString().split("*-*") ?? [];

        const invalidTitle = !title;
        const invalidAuthor = !author;
        const invalidState = !state;
        const invalidPrice = !price || !/^\d{1,3}$/.test(price);
        const invalidISBN = !ISBN;
        const invalidClassCode = !classCode;

        if (
            invalidTitle ||
            invalidAuthor ||
            invalidState ||
            invalidPrice ||
            invalidISBN ||
            invalidClassCode
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
            });
        }

        const book = {
            _id: new mongoose.Types.ObjectId(),
            code: classCode,
            sellerId: locals.user._id,
            title,
            ISBN,
            src: images,
            author,
            price: +price,
            state,
        };
        await db.addBookListing(book);

        return { success: true };
    },
} satisfies Actions;
