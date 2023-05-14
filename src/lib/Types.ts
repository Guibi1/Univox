import type { Dayjs } from "dayjs";
import type { Types } from "mongoose";

/**
 * Represents a user and its public data
 */
export interface User {
    _id: Types.ObjectId;
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
    friendsId: Types.ObjectId[];
    notificationsId: Types.ObjectId[];
    groupsId: Types.ObjectId[];
    settingsId: Types.ObjectId;
    scheduleId: Types.ObjectId;
}

/**
 * Represents a friend group
 */
export interface Group {
    _id: Types.ObjectId;
    name: string;
    usersId: Types.ObjectId[];
}

/**
 * Represents a book to be sold
 */
export interface Book {
    _id: Types.ObjectId;
    code: string;
    sellerId: Types.ObjectId;
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
    _id: Types.ObjectId;
    periods: Period[];
    classes: Class[];
}

/**
 * Represents a time period in a schedule
 */
export interface Period {
    _id: Types.ObjectId;
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
    theory: boolean;
    teacher: string;
    virtual: boolean;
}

/**
 * Represents a user's notification
 */
export interface Notification {
    _id: Types.ObjectId;
    kind: NotificationKind;
    sender: User;
}

/**
 * Represents the type of notification that was received by the user
 */
export enum NotificationKind {
    FriendRequest = "FriendRequest",
}
