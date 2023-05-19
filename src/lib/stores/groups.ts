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
        if (success) refresh();
    }

    async function inviteToGroup(group: Group, users: User[]) {
        const { success } = await (
            await fetch("/api/groups/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ groupId: group._id, usersId: users.map((u) => u._id) }),
            })
        ).json();
        if (success) {
            refresh();
            return true;
        } else {
            return false;
        }
    }

    return {
        subscribe,
        set,
        create,
        quit,
        rename,
        refresh,
        inviteToGroup,
    };
}

const groups = createGroupsStore();
export default groups;
