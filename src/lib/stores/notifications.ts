/**
 * @file A Svelte store that manages the user's notification
 */

import type { Notification, NotificationKind } from "$lib/Types";
import type mongoose from "mongoose";
import { writable } from "svelte/store";

function createNotificationsStore() {
    const { subscribe, set } = writable<Notification[]>();

    /**
     * Updates the store with the latest information from the server
     */
    async function refresh() {
        const { success, notifications } = await (await fetch("/api/notifications")).json();
        if (success) set(notifications);
    }

    /**
     * Sends a notification to a user
     * @param kind The kind of notification to send
     * @param receiverId The user that will receive the notification
     */
    async function create(kind: NotificationKind, receiverId: mongoose.Types.ObjectId) {
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

    /**
     * Removes a notification from the database
     * @param notification The notification to remove
     */
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
        create,
        remove,
        refresh,
    };
}

const notifications = createNotificationsStore();
export default notifications;
