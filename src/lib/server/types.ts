import { Weekday, type Schedule, type User } from "$lib/Types";
import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";

export type ServerUser = User & { passwordHash: string };
export type Token = {
    _id: mongoose.Types.ObjectId;
    token: string;
    userId: mongoose.Types.ObjectId;
};

export const TokenSchema = new Schema<Token>({
    token: String,
    userId: mongoose.Types.ObjectId,
});

export const UserSchema = new Schema<ServerUser>({
    da: String,
    passwordHash: String,
    email: String,
    firstName: String,
    lastName: String,
    scheduleId: mongoose.Types.ObjectId,
});

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
