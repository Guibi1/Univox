import dayjs from "dayjs";
import { Types } from "mongoose";
import type { Class, Period, Schedule } from "./Types";

/**
 * Transforms the Date objects of a serialized Schedule to Dayjs objects
 * @param schedule The schedule to fix
 * @returns A new schedule with Dayjs times
 */
export function scheduleFromJson(schedule: Schedule) {
    const classes: Class[] = [];
    for (const c of schedule.classes) {
        classes.push({ ...c, timeStart: dayjs(c.timeStart), timeEnd: dayjs(c.timeEnd) });
    }

    const periods: Period[] = [];
    for (const p of schedule.periods) {
        periods.push({ ...p, timeStart: dayjs(p.timeStart), timeEnd: dayjs(p.timeEnd) });
    }

    return { ...schedule, classes, periods };
}

/**
 * Creates a new array where the ObjectId are all casted to string
 * @param arr The array to iterate through
 * @returns A new array without any ObjectId
 */
export function arrayIdToString<T extends object>(arr: T[]): T[] {
    return arr.map((i) => objectIdToString(i));
}

/**
 * Casts any ObjectId in the object to string
 * @param object The object to iterate through
 * @returns The object without any ObjectId
 */
export function objectIdToString<T extends object>(object: T): T {
    if (object instanceof Types.ObjectId) {
        return object.toString() as unknown as T;
    } else if (typeof object !== "object" || object === null) {
        return object;
    }

    const keys = Object.keys(object) as Array<keyof T>;
    keys.forEach((key) => {
        const value = object[key];

        if (value instanceof Types.ObjectId) {
            object[key] = (value as Types.ObjectId).toString() as T[keyof T];
        } else if (Array.isArray(value)) {
            object[key] = arrayIdToString(value) as T[keyof T];
        } else if (typeof value === "object" && value !== null) {
            object[key] = objectIdToString(value as T) as T[keyof T];
        }
    });

    return object;
}
