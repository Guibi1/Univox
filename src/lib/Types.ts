import type { Dayjs } from "dayjs";
import type { InferModel } from "drizzle-orm";
import type { User } from "lucia";
import type { booksTable } from "./server/schemas/books";

/**
 * Represents a friend group
 */
export interface Group {
    id: number;
    name: string;
    usersId: string[];
}

/**
 * Represents a book to be sold
 */
export type Book = InferModel<typeof booksTable>

/**
 * Represents a user's schedule
 */
export interface Schedule {
    periods: Period[];
    lessons: Lesson[];
}

/**
 * Represents a time period in a schedule
 */
export interface Period {
    id: number;
    userId: string;

    name: string;
    timeStart: Dayjs;
    timeEnd: Dayjs;
}

/**
 * Represents a time period that comes from Omnviox
 */
export interface Lesson extends Period {
    code: string;
    group: number;
    local: string;
    theory: boolean;
    teacher: string;
    virtual: boolean;
}

export function isLesson(period: Period): period is Lesson {
    return "teacher" in period;
}

/**
 * Represents a user's notification
 */
export interface Notification {
    id: number;
    kind: NotificationKind;
    details: unknown;
    sender: User;
}

/**
 * Represents the type of notification that was received by the user
 */
export type NotificationKind = "FriendRequest" | "GroupRequest";
