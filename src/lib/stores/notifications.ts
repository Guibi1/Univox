import type { Notification } from "$lib/Types";
import { writable } from "svelte/store";

function createNotificationsStore() {
    const { subscribe, set } = writable<Notification[]>();

    async function refresh() {
        const { success, notifications } = await (await fetch("/api/notifications")).json();
        if (success) set(notifications);
    }

    async function add(notification: Notification) {
        const { success, notifications } = await (
            await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notification }),
            })
        ).json();
        if (success) set(notifications);
    }

    async function remove(notification: Notification) {
        const { success, notifications } = await (
            await fetch("/api/notifications", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notification }),
            })
        ).json();
        if (success) set(notifications);
    }

    return {
        subscribe,
        set,
        add,
        remove,
        refresh,
    };
}

const notifications = createNotificationsStore();
export default notifications;
