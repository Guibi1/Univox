import type { Class, Period, Schedule } from "$lib/Types";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import mongoose from "mongoose";

dayjs.extend(weekday);

//Beginning of testing page code
const periodsTest: Class[] = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Yey c'est le 2",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(0).minute(0),
        timeEnd: dayjs().hour(10).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "aName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(12).minute(0),
        timeEnd: dayjs().hour(15).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "BName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(16).minute(30),
        timeEnd: dayjs().hour(20).minute(0),
    },
];
const scheduleTest: Schedule = { _id: new mongoose.Types.ObjectId(), periods: periodsTest };

const periods1Test: Class[] = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Yey c'est le 2",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(9).minute(0),
        timeEnd: dayjs().hour(11).minute(0),
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "aName",
        group: 105,
        local: "B-105",
        type: "L",
        teacher: "asdjkfwlbk",
        virtual: false,
        timeStart: dayjs().hour(12).minute(0),
        timeEnd: dayjs().hour(20).minute(0),
    },
];
const schedule1Test: Schedule = { _id: new mongoose.Types.ObjectId(), periods: periods1Test };

export function show() {
    const periodsFinal = findTimeUnavailable(scheduleTest.periods, schedule1Test.periods);
    for (let i = 0; i < periodsFinal.length; i++) {
        console.log(periodsFinal[i].timeStart);
        console.log(periodsFinal[i].timeEnd);
    }
    const periodsCom = findCommonAvailability(periodsFinal);
    for (let i = 0; i < periodsCom.length; i++) {
        console.log(periodsCom[i].timeStart);
        console.log(periodsCom[i].timeEnd);
    }
}
//End of testing page code

//Takes array created by findTimeUnavailable
//Finds common availabilities
function findCommonAvailability(periods: Period[]) {
    let timeStartCom = dayjs().hour(0).minute(0).second(0);
    let timeEndCom = periods[0].timeStart;
    const periodsCom: Period[] = [];

    if (!timeStartCom.isSame(timeEndCom)) {
        periodsCom.push({
            name: "Indisponible",
            timeStart: timeStartCom,
            timeEnd: timeEndCom,
        });
    }

    for (let i = 0; i < periods.length; i++) {
        if (i === periods.length - 1) {
            break;
        }
        timeStartCom = periods[i].timeEnd;
        timeEndCom = periods[i + 1].timeStart;
        periodsCom.push({
            name: "Indisponible",
            timeStart: timeStartCom,
            timeEnd: timeEndCom,
        });
    }

    timeStartCom = periods[periods.length - 1].timeEnd;
    timeEndCom = dayjs().hour(24).minute(0);
    if (!timeStartCom.isSame(timeEndCom)) {
        periodsCom.push({
            name: "Indisponible",
            timeStart: timeStartCom,
            timeEnd: timeEndCom,
        });
    }
    return periodsCom;
}

/*Creates array that contains periods where atleast one of the two people is occupied,
which means periods of time that are considered not a common availability*/
function findTimeUnavailable(ownPeriods: Period[], theirPeriods: Period[]) {
    let timeStartFinal;
    let timeEndFinal;
    const periodsFinal: Period[] = [];

    for (let i = 0; i < ownPeriods.length; i++) {
        timeStartFinal = ownPeriods[i].timeStart;
        timeEndFinal = ownPeriods[i].timeEnd;

        for (let j = 0; j < theirPeriods.length; j++) {
            if (
                timeStartFinal.isAfter(theirPeriods[j].timeStart) &&
                timeStartFinal.isBefore(theirPeriods[j].timeEnd)
            ) {
                timeStartFinal = theirPeriods[j].timeStart;
            }
            if (
                timeEndFinal.isAfter(theirPeriods[j].timeStart) &&
                timeEndFinal.isBefore(theirPeriods[j].timeEnd)
            ) {
                timeEndFinal = theirPeriods[j].timeEnd;
            }
        }

        if (periodsFinal.length == 0) {
            periodsFinal.push({
                name: "Indisponible",
                timeStart: timeStartFinal,
                timeEnd: timeEndFinal,
            });
        } else {
            for (let k = 0; k < periodsFinal.length; k++) {
                if (!timeStartFinal.isAfter(periodsFinal[k].timeEnd)) {
                    timeStartFinal = periodsFinal[k].timeEnd;
                }
            }
            if (timeStartFinal.isBefore(timeEndFinal)) {
                periodsFinal.push({
                    name: "Indisponible",
                    timeStart: timeStartFinal,
                    timeEnd: timeEndFinal,
                });
            }
        }
    }
    return periodsFinal;
}
