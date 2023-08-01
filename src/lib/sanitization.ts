import dayjs from "dayjs";
import type { Lesson, Period, Schedule } from "./types";

type JsonPeriod = Omit<Period, "timeStart" | "timeEnd"> & { timeStart: string; timeEnd: string };
type JsonLesson = Omit<Lesson, "timeStart" | "timeEnd"> & { timeStart: string; timeEnd: string };
export type JsonSchedule = Omit<Schedule, "periods" | "lessons"> & {
    periods: JsonPeriod[];
    lessons: JsonLesson[];
};

/**
 * Transforms the Date objects of a serialized Schedule to Dayjs objects
 * @param schedule The schedule to fix
 * @returns A new schedule with Dayjs times
 */
export function scheduleToJson(schedule: Schedule): JsonSchedule {
    const lessons: JsonLesson[] = [];
    for (const c of schedule.lessons) {
        lessons.push({ ...c, timeStart: c.timeStart.toJSON(), timeEnd: c.timeEnd.toJSON() });
    }

    const periods: JsonPeriod[] = [];
    for (const p of schedule.periods) {
        periods.push({ ...p, timeStart: p.timeStart.toJSON(), timeEnd: p.timeEnd.toJSON() });
    }

    return { ...schedule, lessons, periods };
}

/**
 * Transforms the Date objects of a serialized Schedule to Dayjs objects
 * @param schedule The schedule to fix
 * @returns A new schedule with Dayjs times
 */
export function scheduleFromJson(schedule: JsonSchedule): Schedule {
    const lessons: Lesson[] = [];
    for (const c of schedule.lessons) {
        lessons.push({ ...c, timeStart: dayjs(c.timeStart), timeEnd: dayjs(c.timeEnd) });
    }

    const periods: Period[] = [];
    for (const p of schedule.periods) {
        periods.push({ ...p, timeStart: dayjs(p.timeStart), timeEnd: dayjs(p.timeEnd) });
    }

    return { ...schedule, lessons, periods };
}
