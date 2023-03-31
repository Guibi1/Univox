import mongoose, { Schema } from "mongoose";

export interface Token {
    _id: mongoose.Types.ObjectId;
    token: string;
    userId: mongoose.Types.ObjectId;
    lastAccessedDate: Date;
}

const TokenSchema = new Schema<Token>({
    token: String,
    userId: mongoose.Types.ObjectId,
    lastAccessedDate: {
        type: Date,
        default: Date.now,
        expires: "2d",
        index: true,
    },
});

const Tokens = mongoose.models["tokens"] ?? mongoose.model("tokens", TokenSchema);
export default Tokens;
