import { browser } from "$app/environment";
import { writable } from "svelte/store";

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

    function getOffset() {
        let date = "Dimanche";
        subscribe((d) => (date = d))();

        if (date == "Samedi") {
            return -1;
        }
        else if (date == "Lundi") {
            return 1;
        }
        else {
            return 0;
        }
    }

    return {
        subscribe,
        setInitial: setStore,
        set,
        getOffset,
    };
}

const startWeekDate = createStartWeekDateStore();
export default startWeekDate;
