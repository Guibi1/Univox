/**
 * @file A Svelte store that manages the user's notification
 */

import type { Notification, NotificationKind } from "$lib/types";
import { writable } from "svelte/store";
import { api } from "sveltekit-api-fetch";

function createNotificationsStore() {
    const { subscribe, set } = writable<Notification[]>();

    /**
     * Updates the store with the latest information from the server
     */
    async function refresh() {
        const { success, notifications } = await (await api.GET("/api/notifications", {})).json();
        if (success) set(notifications);
    }

    /**
     * Sends a notification to a user
     * @param kind The kind of notification to send
     * @param receiverId The user that will receive the notification
     */
    async function create(kind: NotificationKind, receiverId: string) {
        const { success } = await (
            await api.POST("/api/notifications", { body: { kind, receiverId: receiverId } })
        ).json();
        if (success) refresh();
    }

    /**
     * Removes a notification from the database
     * @param notification The notification to remove
     */
    async function remove(notification: Notification) {
        const { success } = await (
            await api.DELETE("/api/notifications", {
                body: {
                    notificationId: notification.id,
                },
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
