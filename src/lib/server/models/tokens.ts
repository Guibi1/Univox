import mongoose, { Schema, Types } from "mongoose";

export interface Token {
    _id: Types.ObjectId;
    token: string;
    userId: Types.ObjectId;
    lastAccessedDate: Date;
}

const TokenSchema = new Schema<Token>({
    token: String,
    userId: Types.ObjectId,
    lastAccessedDate: {
        type: Date,
        default: Date.now,
        expires: "2d",
        index: true,
    },
});

const Tokens = mongoose.models["tokens"] ?? mongoose.model("tokens", TokenSchema);
export default Tokens;
