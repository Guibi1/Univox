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

        // TODO idk what it is now but there will be something here at some point on this branch

        if (!title || !author || !state || !price || !isbn) {
            return fail(400, { title, author, state, price, isbn, missing: true }); //! I just copied this from another page and change da to title :P
        }

        const book = {
            _id: new mongoose.Types.ObjectId(),
            code: "idk",
            sellerId: locals.user._id,
            title: title,
            ISBN: isbn,
            src: "src",
            author: author,
            price: price,
            state: state,
        };
        await db.addBookListing(book);

        return { success: true };
    },
} satisfies Actions;
