import type { Dayjs } from "dayjs";
import type mongoose from "mongoose";

export interface User {
    _id: mongoose.Types.ObjectId;
    da: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface ServerUser extends User {
    passwordHash: string;
    friendsId: mongoose.Types.ObjectId[];
    notificationsId: mongoose.Types.ObjectId[];
    settingsId: mongoose.Types.ObjectId;
    scheduleId: mongoose.Types.ObjectId;
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
    _id: mongoose.Types.ObjectId;
    kind: NotificationKind;
    sender: User;
}

export enum NotificationKind {
    FriendRequest = "FriendRequest",
}
