import type { Period } from "$lib/Types";
import type { Dayjs } from "dayjs";
import mongoose from "mongoose";

/**
 * Calculates the common availabilities for a given day and a list of periods.
 * @param {Dayjs} date - The date to calculate availabilities for.
 * @param {Period[]} periods - The list of periods to calculate availabilities from.
 * @returns {Period[]} An array of periods representing the common availabilities for the given day.
 */
export default function getCommonAvailabilities(date: Dayjs, periods: Period[]): Period[] {
    // The min/max time to check in our algorithm
    const dayStart = date.startOf("day");
    const dayEnd = date.endOf("day");

    const freeTime: Period[] = [];
    let currentEnd = dayStart;

    // Add a free time in our result array
    const addAvailability = (timeStart: Dayjs, timeEnd: Dayjs) =>
        freeTime.push({
            _id: new mongoose.Types.ObjectId(),
            name: "Libre",
            timeStart,
            timeEnd,
        });

    const allPeriods = periods
        // Remove periods that are completely before or after the day
        .filter((p) => p.timeStart.isBefore(dayEnd) && p.timeEnd.isAfter(dayStart))
        // Sort the periods according to their start time
        .sort((a, b) => a.timeStart.diff(b.timeStart));

    for (const period of allPeriods) {
        // Make sure we give the correct start/end knowing that some periods might overflow out of our time range
        const startTime = period.timeStart.isAfter(dayStart) ? period.timeStart : dayStart;
        const endTime = period.timeEnd.isBefore(dayEnd) ? period.timeEnd : dayEnd;

        // If the period starts after the last period ended, we are free between the two
        if (startTime.isAfter(currentEnd)) {
            addAvailability(currentEnd, period.timeStart);
        }

        // If the period ends after the last period ended, update the current end
        // This is to make sure a shorter period wont put the current end earlier than what it was
        if (endTime.isAfter(currentEnd)) {
            currentEnd = endTime;
        }
    }

    // If the last period ended before the end of the day, we are free until then
    if (currentEnd.isBefore(dayEnd)) {
        addAvailability(currentEnd, dayEnd);
    }

    return freeTime;
}
