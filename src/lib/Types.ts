import type { Dayjs } from "dayjs";
import type mongoose from "mongoose";

export type User = {
    da: string;
    email: string;
    firstName: string;
    lastName: string;
    scheduleID: mongoose.Types.ObjectId;
};

export type Book = {
    id: string;
    title: string;
    ISBN: string;
    src: string;
    author: string;
    price: number;
    state: string;
};

export type Schedule = {
    periods: Class[];
};

export type Class = {
    id: string;
    name: string;
    group: number;
    local: string;
    type: "T" | "L";
    teacher: string;
    virtual: boolean;
    weekday: Weekday;
    timeStart: Dayjs;
    timeEnd: Dayjs;
};

export enum Weekday {
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
}
