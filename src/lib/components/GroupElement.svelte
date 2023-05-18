<script lang="ts">
    import { page } from "$app/stores";
    import type { Group } from "$lib/Types";
    import groups from "$lib/stores/groups";
    import Dropdown from "./Dropdown.svelte";
    import Option from "./Option.svelte";

    export let group: Group;

    let newName = group.name;
    let editing = false;

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

<div class="flex items-center justify-between">
    <div class="flex flex-row items-center">
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
            <button
                class="flex h-10 items-center self-center rounded bg-blue-primary font-bold hover:bg-green-900"
                on:click={() => rename(group, newName)}
            >
                Renommer
            </button>
        </div>
    {/if}

    <Dropdown>
        <Option text="Horaire commun" href={getGroupUrl(group)} />
        <Option separate text="Renommer" onClick={() => (editing = true)} />
        <Option separate text="Quitter le groupe" color="red" onClick={() => groups.quit(group)} />
    </Dropdown>
    </div>
    

    <div class="flex items-center">
        <a class="filled" href={getGroupUrl(group)}> Horaire commun </a>
    </div>
</div>
