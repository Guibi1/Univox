import type { User } from "lucia-auth";
import { writable } from "svelte/store";
import { api } from "sveltekit-api-fetch";

function createFriendsStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const { success, friends } = await (await api.GET("/api/friends", {})).json();

        if (success) set(friends);
    }

    async function add(id: string) {
        const { success } = await (
            await api.POST("/api/friends", { body: { friendId: id } })
        ).json();
        if (success) refresh();
    }

    async function remove(id: string) {
        const { success } = await (
            await api.DELETE("/api/friends", { body: { friendId: id } })
        ).json();
        if (success) refresh();
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
