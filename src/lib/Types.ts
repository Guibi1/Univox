import type { Dayjs } from "dayjs";
import type mongoose from "mongoose";

export type User = {
    _id: mongoose.Types.ObjectId;
    da: string;
    email: string;
    firstName: string;
    lastName: string;
    scheduleId: mongoose.Types.ObjectId;
    friends: mongoose.Types.ObjectId[];
};

export type Book = {
    _id: mongoose.Types.ObjectId;
    title: string;
    ISBN: string;
    src: string;
    author: string;
    price: number;
    state: string;
};

export type Schedule = {
    _id: mongoose.Types.ObjectId;
    periods: Class[];
};

export type Class = {
    _id: mongoose.Types.ObjectId;
    name: string;
    group: number;
    local: string;
    type: "T" | "L";
    teacher: string;
    virtual: boolean;
    timeStart: Dayjs;
    timeEnd: Dayjs;
};
