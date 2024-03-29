import type { User } from "lucia";
import { writable } from "svelte/store";
import { api } from "sveltekit-typesafe-api";

function createFriendsStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const { success, friends } = await (await api.GET("/api/friends", {})).json();
        if (success) set(friends);
        return success;
    }

    async function add(id: string) {
        const { success } = await (
            await api.POST("/api/friends", { body: { friendId: id } })
        ).json();
        if (success) refresh();
        return success;
    }

    async function remove(id: string) {
        const { success } = await (
            await api.DELETE("/api/friends", { body: { friendId: id } })
        ).json();
        if (success) refresh();
        return success;
    }

    return {
        subscribe,
        set,
        remove,
        refresh,
        add,
    };
}

const friends = createFriendsStore();
export default friends;
