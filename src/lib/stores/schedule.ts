import { scheduleFromJson, type JsonSchedule } from "$lib/sanitization";
import type { Period, Schedule } from "$lib/types";
import { writable } from "svelte/store";
import { api } from "sveltekit-api-fetch";

function createScheduleStore() {
    const { subscribe, set: setStore } = writable<Schedule>();

    function set(schedule: JsonSchedule) {
        setStore(scheduleFromJson(schedule));
    }

    async function refresh() {
        const { success, schedule } = await (await api.GET("/api/schedule", {})).json();
        if (success) set(schedule);
        return success;
    }

    async function add(period: Period) {
        const { success } = await (
            await api.POST("/api/schedule", {
                body: {
                    periods: [
                        {
                            ...period,
                            id: period.id,
                            timeStart: period.timeStart.toJSON(),
                            timeEnd: period.timeEnd.toJSON(),
                        },
                    ],
                },
            })
        ).json();
        if (success) refresh();
        return success;
    }

    async function remove(period: Period) {
        const { success } = await (
            await api.DELETE("/api/schedule", {
                body: {
                    period: {
                        ...period,
                        id: period.id,
                        timeStart: period.timeStart.toJSON(),
                        timeEnd: period.timeEnd.toJSON(),
                    },
                },
            })
        ).json();
        if (success) refresh();
        return success;
    }

    return {
        subscribe,
        setStore,
        set,
        add,
        remove,
        refresh,
    };
}

const schedule = createScheduleStore();
export default schedule;
