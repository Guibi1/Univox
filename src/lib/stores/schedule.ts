import type { Period, Schedule } from "$lib/Types";
import { scheduleFromJson } from "$lib/sanitization";
import { writable } from "svelte/store";

function createScheduleStore() {
    const { subscribe, set: setStore } = writable<Schedule>();

    function set(schedule: Schedule) {
        setStore(scheduleFromJson(schedule));
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

    async function remove(period: Period) {
        const { success } = await (
            await fetch("/api/schedule", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ period }),
            })
        ).json();
        if (success) refresh();
    }

    return {
        subscribe,
        set,
        add,
        remove,
        refresh,
    };
}

const schedule = createScheduleStore();
export default schedule;
