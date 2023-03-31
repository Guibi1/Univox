import type { Group } from "$lib/Types";
import type mongoose from "mongoose";
import { writable } from "svelte/store";

function createGroupsStore() {
    const { subscribe, set } = writable<Group[]>();

    async function refresh() {
        const groups = await (await fetch("/api/groups")).json();
        set(groups);
    }

    async function get(id: mongoose.Types.ObjectId) {
        await fetch("/api/groups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ gorupId: id }),
        });
        refresh();
    }

    async function create(id: mongoose.Types.ObjectId) {
        await fetch("/api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupId: id }),
        });
        refresh();
    }

    async function quit(id: mongoose.Types.ObjectId) {
        await fetch("/api/groups", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ groupId: id }),
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
