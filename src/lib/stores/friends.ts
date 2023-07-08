import type { User } from "$lib/Types";
import type { Types } from "mongoose";
import { writable } from "svelte/store";
import { api } from "sveltekit-api-fetch";

function createFriendsStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const { success, friends } = await (await api.GET("/api/friends")).json();

        if (success) set(friends);
    }

    async function add(id: Types.ObjectId) {
        const { success } = await (
            await api.POST("/api/friends", { friendId: id.toHexString() })
        ).json();
        if (success) refresh();
    }

    async function remove(id: Types.ObjectId) {
        const { success } = await (
            await api.DELETE("/api/friends", { friendId: id.toHexString() })
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
