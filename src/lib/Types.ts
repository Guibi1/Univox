import type { Dayjs } from "dayjs";
import type mongoose from "mongoose";

export interface User {
    _id: mongoose.Types.ObjectId;
    da: string;
    email: string;
    firstName: string;
    lastName: string;
    scheduleId: mongoose.Types.ObjectId;
}

export interface Book {
    _id: mongoose.Types.ObjectId;
    title: string;
    ISBN: string;
    src: string;
    author: string;
    price: number;
    state: string;
}

export interface Schedule {
    _id: mongoose.Types.ObjectId;
    periods: Period[];
}

export interface Period {
    name: string;
    timeStart: Dayjs;
    timeEnd: Dayjs;
}

export interface Class extends Period {
    _id: mongoose.Types.ObjectId;
    group: number;
    local: string;
    type: "T" | "L";
    teacher: string;
    virtual: boolean;
    weekday: Weekday;
}

export enum Weekday {
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
}
