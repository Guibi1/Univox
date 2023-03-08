import type { User } from "$lib/Types";
import { onMount } from "svelte";
import { writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set: setStore } = writable<User | null>();
    let bc: BroadcastChannel;

    // This syncs the different tabs' user
    onMount(() => {
        bc = new BroadcastChannel("New user data");
        bc.addEventListener("message", (e) => setStore(e.data));
        return () => bc.close();
    });

    const set: typeof setStore = (user) => {
        setStore(user);
        if (bc) bc.postMessage(user);
    };

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
