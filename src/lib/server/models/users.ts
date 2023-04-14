import type { ServerUser } from "$lib/Types";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema<ServerUser>({
    da: {
        type: String,
        text: true,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "schedules",
        required: true,
    },
    friendsId: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: function (arr: unknown[]) {
                return arr.length === new Set(arr).size;
            },
            message: "Duplicate values are not allowed in the array.",
        },
        ref: "users",
        required: true,
        default: [],
    },
    groupsId: {
        type: [mongoose.Schema.Types.ObjectId],

        validate: {
            validator: function (arr: unknown[]) {
                return arr.length === new Set(arr).size;
            },
            message: "Duplicate values are not allowed in the array.",
        },
        ref: "groups",
        required: true,
        default: [],
    },
    settingsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "settings",
        required: true,
    },
    notificationsId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "notifications",
        required: true,
        default: [],
    },
});

const Users = mongoose.models["users"] ?? mongoose.model("users", UserSchema);
export default Users;
