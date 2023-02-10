import type { User } from "$lib/Types";
import { writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set } = writable<User | null>();

    async function signout() {
        await fetch("/api/signout", { method: "POST" });
    }

    return {
        subscribe,
        signout,
        set,
    };
}

const user = createUserStore();
export default user;
