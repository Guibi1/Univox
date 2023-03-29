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
        if (!title) {
            return fail(400, {title, missing: true});
        }
        if (!author) {
            return fail(400, {author, missing: true});
        }
        if (!state) {
            return fail(400, {state, missing: true});
        }
        if (!price || !/.{1,3}/.test(price.toString())) {
            return fail(400, {price, missing: true});
        }
        if (!isbn) {
            return fail(400, {isbn, missing: true});
        }
        if (!classCode) {
            return fail(400, {classCode, missing: true});
        }

        const book = {
            _id: new mongoose.Types.ObjectId(),
            code: classCode,
            sellerId: locals.user._id,
            title: title,
            ISBN: isbn,
            src: "images source need to be added here :P",
            author: author,
            price: price,
            state: state,
        };
        await db.addBookListing(book);

        return { success: true };
    },
} satisfies Actions;
