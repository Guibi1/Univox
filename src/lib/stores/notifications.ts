import type { Notification, NotificationKind } from "$lib/Types";
import type mongoose from "mongoose";
import { writable } from "svelte/store";

function createNotificationsStore() {
    const { subscribe, set } = writable<Notification[]>();

    async function refresh() {
        const { success, notifications } = await (await fetch("/api/notifications")).json();
        if (success) set(notifications);
    }

    async function add(kind: NotificationKind, receiverId: mongoose.Types.ObjectId) {
        const { success } = await (
            await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ kind, receiverId }),
            })
        ).json();
        if (success) refresh();
    }

    async function remove(notification: Notification) {
        const { success } = await (
            await fetch("/api/notifications", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notification }),
            })
        ).json();
        if (success) refresh();
    }

    return {
        subscribe,
        set,
        create: add,
        remove,
        refresh,
    };
}

const notifications = createNotificationsStore();
export default notifications;
