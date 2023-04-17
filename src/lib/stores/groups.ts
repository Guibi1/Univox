import type { Group, User } from "$lib/Types";
import type mongoose from "mongoose";
import { writable } from "svelte/store";

function createGroupsStore() {
    const { subscribe, set } = writable<Group[]>();

    async function refresh() {
        const groups = await (await fetch("/api/groups")).json();
        set(groups);
    }

    async function create(friends: User[]) {
        await fetch("/api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendsId: friends.map((u) => u._id) }),
        });
        refresh();
    }

    async function quit(groupId: mongoose.Types.ObjectId) {
        await fetch("/api/groups", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupId }),
        });
        refresh();
    }

    return {
        subscribe,
        set,
        create,
        quit,
        refresh,
    };
}

const groups = createGroupsStore();
export default groups;
