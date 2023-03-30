/* eslint-disable prefer-const */
import { SystemDrive } from "$env/static/private";
import type { Class, Period, Schedule } from "$lib/Types";
import dayjs from "dayjs";
import mongoose from "mongoose";

let scheduleCon: Class[] = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Yey c'est le 2",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().date(2).hour(6).minute(0),
        timeEnd: dayjs().date(2).hour(8).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "aName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(14).minute(0),
        timeEnd: dayjs().hour(16).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "BName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().weekday(6).hour(16).minute(30),
        timeEnd: dayjs().weekday(6).hour(20).minute(0),
    },
];
let schedule: Schedule = { _id: new mongoose.Types.ObjectId(), periods: scheduleCon };

let schedule1Con: Class[] = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Yey c'est le 2",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().date(2).hour(6).minute(0),
        timeEnd: dayjs().date(2).hour(8).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "aName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(14).minute(0),
        timeEnd: dayjs().hour(16).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "BName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().weekday(6).hour(16).minute(30),
        timeEnd: dayjs().weekday(6).hour(20).minute(0),
    },
];
let schedule1: Schedule = { _id: new mongoose.Types.ObjectId(), periods: schedule1Con };

//Comment faire pour run cette partie code
for (let i = 0; i < findAvailabilities(schedule, schedule1).periods.length; i++) {
    console.log(findAvailabilities(schedule, schedule1).periods[i].timeStart);
    console.log(findAvailabilities(schedule, schedule1).periods[i].timeEnd);
}

function findAvailabilities(ownSchedule: Schedule, theirSchedule: Schedule) {
    let timeStartFinal;
    let timeEndFinal;
    let scheduleFinal = <Schedule>{};

    for (let i = 0; i < theirSchedule.periods.length; i++) {
        timeStartFinal = theirSchedule.periods[i].timeStart;
        timeEndFinal = theirSchedule.periods[i].timeEnd;

        for (let j = 0; j < ownSchedule.periods.length; j++) {
            if (
                timeStartFinal.isAfter(ownSchedule.periods[j].timeStart) &&
                timeStartFinal.isBefore(ownSchedule.periods[j].timeEnd)
            ) {
                timeStartFinal = ownSchedule.periods[j].timeStart;
            }
            if (
                timeEndFinal.isAfter(ownSchedule.periods[j].timeStart) &&
                timeEndFinal.isBefore(ownSchedule.periods[j].timeEnd)
            ) {
                timeEndFinal = ownSchedule.periods[j].timeEnd;
            }
        }
        scheduleFinal.periods.push({
            name: "Libre",
            timeStart: timeStartFinal,
            timeEnd: timeEndFinal,
        });
    }
    return scheduleFinal;
}

/*function mergePeriod(ownSchedule: Schedule, period: Period) {
    let timeStartFinal = period.timeStart;
    let timeEndFinal = period.timeEnd;

    for (let i = 0; i < ownSchedule.periods.length; i++) {
        if (
            timeStartFinal.isAfter(ownSchedule.periods[i].timeStart) &&
            timeStartFinal.isBefore(ownSchedule.periods[i].timeEnd)
        ) {
            timeStartFinal = ownSchedule.periods[i].timeStart;
        }
        if (
            timeEndFinal.isAfter(ownSchedule.periods[i].timeStart) &&
            timeEndFinal.isBefore(ownSchedule.periods[i].timeEnd)
        ) {
            timeEndFinal = ownSchedule.periods[i].timeEnd;
        }
    }
    //Retourne période temps indisponible
    //Pour fonction avant, faire push cette période, sans prendre période horaire originale
    //for(j){ mergePeriod(ownSchedule,theirSchedule.period[j])}
    return { name: "Libre", timeStart: timeStartFinal, timeEnd: timeEndFinal };
}*/
