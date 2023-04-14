import type { Book } from "$lib/Types";
import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema<Book>({
    code: {
        type: String,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
    },
    src: {
        type: [String],
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
});

const Books = mongoose.models["books"] ?? mongoose.model("books", BookSchema);
export default Books;
