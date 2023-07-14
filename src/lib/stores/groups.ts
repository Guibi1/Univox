import type { Group } from "$lib/types";
import type { User } from "lucia-auth";
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
            await api.POST("/api/groups", { usersId: users.map((u) => u.id) })
        ).json();
        if (success) refresh();
    }

    async function quit(group: Group) {
        const { success } = await (await api.DELETE("/api/groups", { groupId: group.id })).json();
        if (success) refresh();
    }

    async function rename(group: Group, name: string) {
        const { success } = await (
            await api.POST("/api/groups/name", { groupId: group.id, name })
        ).json();
        if (success) refresh();
    }

    async function inviteToGroup(group: Group, users: User[]) {
        const { success } = await (
            await api.POST("/api/groups/invite", {
                groupId: group.id,
                usersId: users.map((u) => u.id),
            })
        ).json();
        if (success) refresh();
    }

    async function getMembers(group: Group) {
        const { success, members } = await (
            await api.POST("/api/groups/members", { groupId: group.id })
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
