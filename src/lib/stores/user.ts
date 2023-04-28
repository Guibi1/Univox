import { browser } from "$app/environment";
import { invalidate } from "$app/navigation";
import type { User } from "$lib/Types";
import { writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set: setStore, update } = writable<User>();
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
        fetch("/api/user/avatar", { method: "POST", body: seed });
        update((user) => ({ ...user, avatar: seed }));
    }

    async function setEmail(email: string) {
        fetch("/api/user/email", { method: "POST", body: email });
        update((user) => ({ ...user, email: email }));
    }

    return {
        subscribe,
        set,
        refresh,
        setAvatar,
        setEmail,
        update,
    };
}

const user = createUserStore();
export default user;
