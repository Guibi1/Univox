import type { Period, Schedule } from "$lib/Types";
import { writable } from "svelte/store";

function createScheduleStore() {
    const { subscribe, set } = writable<Schedule>();

    async function refresh() {
        const schedule = await (await fetch("/api/schedule")).json();
        set(schedule);
    }

    async function add(period: Period) {
        await fetch("/api/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ periods: [period] }),
        });
        refresh();
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
