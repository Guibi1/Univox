import { browser } from "$app/environment";
import { invalidate } from "$app/navigation";
import type { User } from "$lib/Types";
import { writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set: setStore } = writable<User>();
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
        const { success, user } = await (await fetch("/api/user")).json();
        if (success) set(user);
    }

    async function setAvatar(seed: string) {
        const { success } = await (
            await fetch("/api/user/avatar", { method: "POST", body: seed })
        ).json();
        if (success) refresh();
    }

    return {
        subscribe,
        set,
        refresh,
        setAvatar,
    };
}

const user = createUserStore();
export default user;
