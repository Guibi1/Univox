import type { Period, User } from "$lib/Types";
import { writable } from "svelte/store";
//
function createHoraireStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const horaire = await (await fetch("/api/schedule")).json();
        set(horaire);
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

const horaire = createHoraireStore();
export default horaire;
