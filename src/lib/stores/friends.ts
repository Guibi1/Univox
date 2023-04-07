import type { User } from "$lib/Types";
import type mongoose from "mongoose";
import { writable } from "svelte/store";

function createFriendsStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const { success, friends } = await (await fetch("/api/friends")).json();
        if (success) set(friends);
    }

    async function getUser(id: mongoose.Types.ObjectId) {
        return await (await fetch(`/api/users/${id}`)).json();
    }

    async function add(id: mongoose.Types.ObjectId) {
        const { success, friends } = await (
            await fetch("/api/friends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId: id }),
            })
        ).json();
        if (success) set(friends);
    }

    async function remove(id: mongoose.Types.ObjectId) {
        const { success, friends } = await (
            await fetch("/api/friends", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId: id }),
            })
        ).json();
        if (success) set(friends);
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
