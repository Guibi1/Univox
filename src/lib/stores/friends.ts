import type { User } from "$lib/Types";
import type mongoose from "mongoose";
import { writable } from "svelte/store";

function createFriendsStore() {
    const { subscribe, set } = writable<User[]>();

    async function refresh() {
        const friends = await (await fetch("/api/friends")).json();
        set(friends);
    }

    async function get(id: mongoose.Types.ObjectId) {
        return await (await fetch(`/api/users/${id}`)).json();
    }

    async function add(id: mongoose.Types.ObjectId) {
        await fetch("/api/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId: id }),
        });
        refresh();
    }

    async function remove(id: mongoose.Types.ObjectId) {
        await fetch("/api/friends", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId: id }),
        });
        refresh();
    }

    return {
        subscribe,
        set,
        add,
        remove,
        refresh,
    };
}

const friends = createFriendsStore();
export default friends;
