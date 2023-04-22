import { browser } from "$app/environment";
import dayjs from "dayjs";
import { derived, writable } from "svelte/store";

export type FirstDayOfTheWeek = "Samedi" | "Dimanche" | "Lundi";

function createFirstDayOfTheWeekStore() {
    const { subscribe, set: setStore } = writable<FirstDayOfTheWeek>("Dimanche");
    let bc: BroadcastChannel;

    if (browser) {
        bc = new BroadcastChannel("New FirstDayOfTheWeek data");
        bc.addEventListener("message", (e) => setStore(e.data));
    }

    async function set(day: FirstDayOfTheWeek) {
        setStore(day);
        if (bc) bc.postMessage(day);
        await fetch("/api/settings/firstDayOfTheWeek", {
            method: "PUT",
            body: day,
        });
    }

    return {
        subscribe,
        setInitial: setStore,
        set,
    };
}

const firstDayOfTheWeek = createFirstDayOfTheWeekStore();
export default firstDayOfTheWeek;

export const weekdayOffset = derived(firstDayOfTheWeek, ($firstDayOfTheWeek) => {
    const currentDate = dayjs().day();

    let offset = $firstDayOfTheWeek === "Samedi" ? -1 : $firstDayOfTheWeek === "Lundi" ? 1 : 0;

    if (offset == 1 && currentDate == 0) {
        offset -= 7;
    } else if (offset == -1 && currentDate == 6) {
        offset += 7;
    }

    return offset;
});
