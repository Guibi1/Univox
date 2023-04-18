import type { Class, Period, Schedule } from "$lib/Types";
import dayjs from "dayjs";
import { writable } from "svelte/store";

function createScheduleStore() {
    const { subscribe, set: setStore } = writable<Schedule>();

    async function set(schedule: Schedule) {
        const classes: Class[] = [];
        for (const c of schedule.classes) {
            classes.push({ ...c, timeStart: dayjs(c.timeStart), timeEnd: dayjs(c.timeEnd) });
        }

        const periods: Period[] = [];
        for (const p of schedule.periods) {
            periods.push({ ...p, timeStart: dayjs(p.timeStart), timeEnd: dayjs(p.timeEnd) });
        }

        setStore({ ...schedule, classes, periods });
    }

    async function refresh() {
        const { success, schedule } = await (await fetch("/api/schedule")).json();
        if (success) set(schedule);
    }

    async function add(period: Period) {
        const { success } = await (
            await fetch("/api/schedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ periods: [period] }),
            })
        ).json();
        if (success) refresh();
    }

    return {
        subscribe,
        set,
        add,
        refresh,
    };
}

const schedule = createScheduleStore();
export default schedule;
