import type { Group, User } from "$lib/Types";
import { writable } from "svelte/store";

function createGroupsStore() {
    const { subscribe, set } = writable<Group[]>();

    async function refresh() {
        const groups = await (await fetch("/api/groups")).json();
        set(groups);
    }

    async function create(users: User[]) {
        const { success } = await (
            await fetch("/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usersId: users.map((u) => u._id) }),
            })
        ).json();
        if (success) refresh();
    }

    async function quit(group: Group) {
        const { success } = await (
            await fetch("/api/groups", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ groupId: group._id }),
            })
        ).json();
        if (success) refresh();
    }

    async function rename(group: Group, name: string) {
        const { success } = await (
            await fetch("/api/groups/name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ groupId: group._id, name }),
            })
        ).json();
        console.log("🚀 ~ file: groups.ts:40 ~ rename ~ success:", success);
        if (success) refresh();
    }

    return {
        subscribe,
        set,
        create,
        quit,
        rename,
        refresh,
    };
}

const groups = createGroupsStore();
export default groups;
