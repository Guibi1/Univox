<script lang="ts">
    import { page } from "$app/stores";
    import type { Group, User } from "$lib/Types";
    import groups from "$lib/stores/groups";
    import Dropdown from "./Dropdown.svelte";
    import ExpandableArrow from "./ExpandableArrow.svelte";
    import Option from "./Option.svelte";

    export let group: Group;
    export let selectedFriends: User[];

    let newName = group.name;
    let editing = false;
    let members: User[] | null = null;

    function rename(group: Group, newName: string) {
        groups.rename(group, newName);
        editing = false;
    }

    // Generates the search params that redirects to the user's schedule
    $: getGroupUrl = (group: Group) => {
        const params = new URLSearchParams($page.url.searchParams);
        params.delete("friendId");
        params.delete("commonSchedule");
        params.set("groupId", group._id.toString());
        return `?${params}`;
    };
</script>

<div class="flex flex-col">
    <div class="flex gap-2">
        <ExpandableArrow
            on:toggle={async ({ detail: open }) => {
                if (open) {
                    members = await groups.getMembers(group);
                } else {
                    members = null;
                }
            }}
        />

        {#if !editing}
            {group.name}
        {:else}
            <div class="flex">
                <input
                    type="text"
                    bind:value={newName}
                    on:keypress={(e) => {
                        if (e.key == "Enter") {
                            rename(group, newName);
                        }
                    }}
                    class="rounded-lg text-lg"
                />
            </div>
        {/if}
    </div>

    {#if members}
        <ul class="pl-10">
            {#each members as user}
                <li>
                    {user.firstName}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<div class="flex gap-4">
    {#if !editing}
        <a class="filled" href={getGroupUrl(group)}> Horaire commun </a>
    {:else}
        <button class="filled" on:click={() => rename(group, newName)}> Renommer </button>
    {/if}

    <Dropdown>
        <Option text="Horaire commun" href={getGroupUrl(group)} />
        <Option text="Renommer" onClick={() => (editing = true)} />
        <Option
            separate
            text="Inviter les amis sélectionnés"
            color="green"
            onClick={() => groups.inviteToGroup(group, selectedFriends)}
        />
        <Option separate text="Quitter le groupe" color="red" onClick={() => groups.quit(group)} />
    </Dropdown>
</div>
