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
        const price = +(data.get("price")?.toString() ?? "0");
        const isbn = data.get("isbn")?.toString();
        const classCode = data.get("classCode")?.toString();
        const images = data.get("images")?.toString().split("*-*");

        if (!title || !author || !state || !price || !isbn || !classCode) {
            return fail(400, { title, author, state, price, isbn, classCode, missing: true }); //! I just copied this from another page and change da to title :P
        }

        const book = {
            _id: new mongoose.Types.ObjectId(),
            code: classCode,
            sellerId: locals.user._id,
            title: title,
            ISBN: isbn,
            src: "Images Need To Be Added Here :P",
            author: author,
            price: price,
            state: state,
        };
        await db.addBookListing(book);

        return { success: true };
    },
} satisfies Actions;
