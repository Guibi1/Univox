import type { Group } from "$lib/types";
import { getModalStore } from "@skeletonlabs/skeleton";
import type { User } from "lucia";
import { writable } from "svelte/store";
import { api } from "sveltekit-typesafe-api";

function createGroupsStore() {
    const { subscribe, set } = writable<Group[]>();

    async function refresh() {
        const { success, groups } = await (await api.GET("/api/groups", {})).json();
        if (success) set(groups);
        return success;
    }

    async function create(name: string, users: User[]) {
        const { success } = await (
            await api.POST("/api/groups", { body: { name, usersId: users.map((u) => u.userId) } })
        ).json();
        if (success) refresh();
        return success;
    }

    async function quit(group: Group) {
        const { success } = await (
            await api.DELETE("/api/groups", { body: { groupId: group.id } })
        ).json();
        if (success) refresh();
        return success;
    }

    async function rename(group: Group) {
        const modalStore = getModalStore();

        modalStore.trigger({
            type: "prompt",
            title: "Renommer le groupe",
            body: "Entrez le nouveau nom du groupe",
            value: group.name,
            valueAttr: { type: "text", minlength: 3, maxlength: 30, required: true },
            response: async (name: string) => {
                const { success } = await (
                    await api.POST("/api/groups/name", { body: { groupId: group.id, name } })
                ).json();
                if (success) refresh();
            },
        });
    }

    async function inviteToGroup(group: Group, users: User[]) {
        const { success } = await (
            await api.POST("/api/groups/invite", {
                body: {
                    groupId: group.id,
                    usersId: users.map((u) => u.userId),
                },
            })
        ).json();
        if (success) refresh();
        return success;
    }

    async function getMembers(group: Group) {
        const { success, members } = await (
            await api.POST("/api/groups/members", { body: { groupId: group.id } })
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
