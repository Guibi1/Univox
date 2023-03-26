import { browser } from "$app/environment";
import { invalidate } from "$app/navigation";
import type { User } from "$lib/Types";
import { writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set: setStore } = writable<User | null>();
    let bc: BroadcastChannel;

    // This syncs the different tabs' user
    if (browser) {
        bc = new BroadcastChannel("New user data");
        bc.addEventListener("message", (e) => {
            setStore(e.data);
            if (!e.data) invalidate("app:user");
        });
    }

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
