import type { User } from "$lib/Types";
import type { Types } from "mongoose";
import { writable } from "svelte/store";

function createFriendsStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const { success, friends } = await (await fetch("/api/friends")).json();
        if (success) set(friends);
    }

    async function add(id: Types.ObjectId) {
        const { success } = await (
            await fetch("/api/friends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId: id }),
            })
        ).json();
        if (success) refresh();
    }

    async function remove(id: Types.ObjectId) {
        const { success } = await (
            await fetch("/api/friends", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId: id }),
            })
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
