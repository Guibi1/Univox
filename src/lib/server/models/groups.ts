import type { Group } from "$lib/Types";
import mongoose, { Schema } from "mongoose";

const GroupSchema = new Schema<Group>({
    name: {
        type: String,
        required: true,
    },
    usersId: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
        validate: {
            validator: function (arr: unknown[]) {
                return arr.length === new Set(arr).size;
            },
            message: "Duplicate values are not allowed in the array.",
        },
        ref: "users",
    },
});

const Groups = mongoose.models["groups"] ?? mongoose.model("groups", GroupSchema);
export default Groups;
