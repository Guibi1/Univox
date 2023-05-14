import type { Period, Schedule } from "$lib/Types";
import type { Dayjs } from "dayjs";
import { Types } from "mongoose";

/**
 * Calculates the common occupied time for a given day and a list of periods.
 * @param {Dayjs} date - The date to calculate occupied time for.
 * @param {Period[]} periods - The list of periods to calculate occupied time from.
 * @returns {Period[]} An array of periods representing the occupied time for the given day.
 */
export function getCommonOccupied(date: Dayjs, periods: Period[]): Period[] {
    // The min/max time to check in our algorithm
    const dayStart = date.startOf("day");
    const dayEnd = date.endOf("day");

    const occupiedTime: Period[] = [];

    // Add a free time in our result array
    const addOccupied = (timeStart: Dayjs, timeEnd: Dayjs) =>
        occupiedTime.push({
            _id: new Types.ObjectId(),
            name: "Occupé",
            timeStart,
            timeEnd,
        });

    const allPeriods = periods
        // Remove periods that are completely before or after the day
        .filter((p) => p.timeStart.isBefore(dayEnd) && p.timeEnd.isAfter(dayStart))
        // Sort the periods according to their start time
        .sort((a, b) => a.timeStart.diff(b.timeStart));

    const firstPeriod = allPeriods.shift();
    if (!firstPeriod) {
        return [];
    }

    let currentStart = firstPeriod.timeStart;
    let currentEnd = firstPeriod.timeEnd;

    for (const period of allPeriods) {
        // Make sure we give the correct start/end knowing that some periods might overflow out of our time range
        const startTime = period.timeStart.isAfter(dayStart) ? period.timeStart : dayStart;
        const endTime = period.timeEnd.isBefore(dayEnd) ? period.timeEnd : dayEnd;

        // If the period starts after the last period ended, the occupied time is added
        if (startTime.isAfter(currentEnd)) {
            addOccupied(currentStart, currentEnd);
            currentStart = startTime;
            currentEnd = endTime;
        }

        // If the period ends after the last period ended, update the current end
        // This is to make sure a shorter period wont put the current end earlier than what it was
        if (endTime.isAfter(currentEnd)) {
            currentEnd = endTime;
        }
    }

    // Add the remaining occupied period
    addOccupied(currentStart, currentEnd);

    return occupiedTime;
}

/**
 * Calculates the common occupations for a given day and a list of periods.
 * @param {Dayjs} week - The week to calculate occupations for.
 * @param {Period[]} periods - The list of periods to calculate occupations from.
 * @returns {Period[]} An array of periods representing the common occupations for the given day.
 */
export function getWeekCommonOccupations(week: Dayjs, periods: Period[]): Schedule {
    const free: Period[] = [];
    //On fait les « CommonOccupations » de chaque jour de la semaine
    for (let i = 0; i < 7; i++) {
        free.push(...getCommonOccupied(week.day(i), periods));
    }

    //Et on return les périodes libres
    return {
        _id: new Types.ObjectId(),
        periods: free,
        classes: [],
    };
}
