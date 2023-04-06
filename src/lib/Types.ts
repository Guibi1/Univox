import type { Dayjs } from "dayjs";
import type mongoose from "mongoose";

export interface User {
    _id: mongoose.Types.ObjectId;
    da: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    friendsId: mongoose.Types.ObjectId[];
}

export interface Book {
    _id: mongoose.Types.ObjectId;
    code: string;
    sellerId: mongoose.Types.ObjectId;
    title: string;
    ISBN: string;
    src: string[];
    author: string;
    price: number;
    state: string;
}

export interface Schedule {
    _id: mongoose.Types.ObjectId;
    periods: Period[];
}

export interface Period {
    _id: mongoose.Types.ObjectId;
    name: string;
    timeStart: Dayjs;
    timeEnd: Dayjs;
}

export interface Class extends Period {
    code: string;
    group: number;
    local: string;
    type: "T" | "L";
    teacher: string;
    virtual: boolean;
    timeStart: Dayjs;
    timeEnd: Dayjs;
}

export interface Notification {
    kind: NotificationKind;
    senderId: mongoose.Types.ObjectId;
}

export enum NotificationKind {
    FriendRequest,
}
