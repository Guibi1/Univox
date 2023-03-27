import * as db from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import mongoose from "mongoose";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const title = data.get("title")?.toString();
        const author = data.get("author")?.toString();
        const state = data.get("state")?.toString();
        const priceString = data.get("price")?.toString ?? "";
        const price = +priceString;
        const isbn = data.get("isbn")?.toString();

        // TODO idk what it is now but there will be something here at some point on this branch

        if (!title || !author || !state || !price || !isbn) {
            return fail(400, {title, missing: true}); //! I just copied this from another page and change da to title :P
        }

        const book = {
            _id: new mongoose.Types.ObjectId(),
            code: "idk",
            sellerId: new mongoose.Types.ObjectId(), // TODO mettre le vrai ID de l'utilisateur
            title: title,
            ISBN: isbn,
            src: "src",
            author: author,
            price: price,
            state: state
        };
        await db.addBookListing(book);

        return { success: true };
    },
} satisfies Actions;
