import dayjs from "dayjs";
import type { Lesson, Period, Schedule } from "./types";

/**
 * Transforms the Date objects of a serialized Schedule to Dayjs objects
 * @param schedule The schedule to fix
 * @returns A new schedule with Dayjs times
 */
export function scheduleFromJson(schedule: Schedule) {
    const classes: Lesson[] = [];
    for (const c of schedule.lessons) {
        classes.push({ ...c, timeStart: dayjs(c.timeStart), timeEnd: dayjs(c.timeEnd) });
    }

    const periods: Period[] = [];
    for (const p of schedule.periods) {
        periods.push({ ...p, timeStart: dayjs(p.timeStart), timeEnd: dayjs(p.timeEnd) });
    }

    return { ...schedule, classes, periods };
}
