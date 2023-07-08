import type { Group, User } from "$lib/Types";
import { writable } from "svelte/store";
import { api } from "sveltekit-api-fetch";

function createGroupsStore() {
    const { subscribe, set } = writable<Group[]>();

    async function refresh() {
        const groups = await (await api.GET("/api/groups")).json();
        set(groups);
    }

    async function create(users: User[]) {
        const { success } = await (
            await api.POST("/api/groups", { usersId: users.map((u) => u._id.toHexString()) })
        ).json();
        if (success) refresh();
    }

    async function quit(group: Group) {
        const { success } = await (
            await api.DELETE("/api/groups", { groupId: group._id.toHexString() })
        ).json();
        if (success) refresh();
    }

    async function rename(group: Group, name: string) {
        const { success } = await (
            await api.POST("/api/groups/name", { groupId: group._id.toHexString(), name })
        ).json();
        if (success) refresh();
    }

    async function inviteToGroup(group: Group, users: User[]) {
        const { success } = await (
            await api.POST("/api/groups/invite", {
                groupId: group._id.toHexString(),
                usersId: users.map((u) => u._id.toHexString()),
            })
        ).json();
        if (success) refresh();
    }

    async function getMembers(group: Group) {
        const { success, members } = await (
            await api.POST("/api/groups/members", { groupId: group._id.toHexString() })
        ).json();
        if (success) refresh();

        return members;
    }

    return {
        subscribe,
        set,
        create,
        quit,
        rename,
        refresh,
        inviteToGroup,
        getMembers,
    };
}

const groups = createGroupsStore();
export default groups;
