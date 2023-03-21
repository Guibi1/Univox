import { browser } from "$app/environment";
import dayjs, { Dayjs } from "dayjs";
import { derived, writable } from "svelte/store";

export type StartWeekDate = "Samedi" | "Dimanche" | "Lundi";

function createStartWeekDateStore() {
    const { subscribe, set: setStore } = writable<StartWeekDate>("Dimanche");
    let bc: BroadcastChannel;

    if (browser) {
        bc = new BroadcastChannel("New startWeekDate data");
        bc.addEventListener("message", (e) => apply(e.data));
    }

    function apply(date: StartWeekDate) {
        setStore(date);
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-startWeekDate", date);
        }
    }

    function set(date: StartWeekDate) {
        apply(date);
        fetch("/api/settings/startWeekDate", {
            method: "PUT",
            body: date,
        });
        if (bc) bc.postMessage(date);
    }

    return {
        subscribe,
        setInitial: setStore,
        set,
    };
}

const startWeekDate = createStartWeekDateStore();
export default startWeekDate;

export const weekdayOffset = derived(startWeekDate, ($startWeekDate) => {
    const currentDate = dayjs().day();

    let offset = $startWeekDate === "Samedi" ? -1 : $startWeekDate === "Lundi" ? 1 : 0;

    if (offset == 1 && currentDate == 0) {
        offset -= 7;
    } else if (offset == -1 && currentDate == 6) {
        offset += 7;
    }

    return offset;
});

// Fonction qui permet de savoir si deux dayjs désigne le même jour
export const dateAreTheSame = (day1: Dayjs, day2: Dayjs) => {
    return (
        day1.year() === day2.year() && day1.month() === day2.month() && day1.date() === day2.date()
    );
};
