import { Weekday, type Schedule, type User } from "$lib/Types";
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
        type: [{ type: mongoose.Schema.Types.ObjectId, unique: true }],
        ref: "users",
        required: true,
        default: [],
    },
});

// Schedule
export const ScheduleSchema = new Schema<Schedule>({
    periods: [
        {
            id: String,
            name: String,
            group: Number,
            local: String,
            type: ["T", "L"],
            teacher: String,
            virtual: Boolean,
            weekday: Weekday,
            timeStart: dayjs.Dayjs,
            timeEnd: dayjs.Dayjs,
        },
    ],
});
