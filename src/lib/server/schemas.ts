import type { Book, Schedule, User } from "$lib/Types";
import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";

// Tokens
export interface Token {
    _id: mongoose.Types.ObjectId;
    token: string;
    userId: mongoose.Types.ObjectId;
    lastAccessedDate: Date;
}

export const TokenSchema = new Schema<Token>({
    token: String,
    userId: mongoose.Types.ObjectId,
    lastAccessedDate: {
        type: Date,
        default: Date.now,
        expires: "1h",
        index: true,
    },
});

// Users
export interface ServerUser extends User {
    passwordHash: string;
}

export const UserSchema = new Schema<ServerUser>({
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
});

// Schedule
export const ScheduleSchema = new Schema<Schedule>({
    periods: {
        type: [
            {
                code: String,
                name: String,
                group: Number,
                local: String,
                type: String,
                teacher: String,
                virtual: Boolean,
                timeStart: dayjs.Dayjs,
                timeEnd: dayjs.Dayjs,
            },
        ],
        required: true,
    },
});

// Book
export const BookSchema = new Schema<Book>({
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
        type: String,
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
