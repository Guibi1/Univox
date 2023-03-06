import type { User } from "$lib/Types";
import { writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set } = writable<User | null>();

    async function refresh() {
        const user = await (await fetch("/api/user")).json();
        set(user);
    }

    return {
        subscribe,
        set,
        refresh,
    };
}

const user = createUserStore();
export default user;
