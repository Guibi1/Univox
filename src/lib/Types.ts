import type { Dayjs } from "dayjs";
import type mongoose from "mongoose";

/**
 * Represents a user and its public data
 */
export interface User {
    _id: mongoose.Types.ObjectId;
    da: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

/**
 * Represents a user as it is stored on the database.
 * An object of this type shoud never leave the server-side
 */
export interface ServerUser extends User {
    passwordHash: string;
    friendsId: mongoose.Types.ObjectId[];
    notificationsId: mongoose.Types.ObjectId[];
    settingsId: mongoose.Types.ObjectId;
    scheduleId: mongoose.Types.ObjectId;
}

/**
 * Represents a book to be sold
 */
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

/**
 * Represents a user's schedule
 */
export interface Schedule {
    _id: mongoose.Types.ObjectId;
    periods: Period[];
}

/**
 * Represents a time period in a schedule
 */
export interface Period {
    _id: mongoose.Types.ObjectId;
    name: string;
    timeStart: Dayjs;
    timeEnd: Dayjs;
}

/**
 * Represents a time period that comes from Omnviox
 */
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

/**
 * Represents a user's notification
 */
export interface Notification {
    _id: mongoose.Types.ObjectId;
    kind: NotificationKind;
    sender: User;
}

/**
 * Represents the type of notification that was received by the user
 */
export enum NotificationKind {
    FriendRequest = "FriendRequest",
}
