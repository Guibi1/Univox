<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Avatar from "$lib/components/Avatar.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import UserCard from "$lib/components/UserCard.svelte";
    import { scheduleFromJson } from "$lib/sanitization";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import schedule from "$lib/stores/schedule";
    import type { Group } from "$lib/types.js";
    import { Accordion, AccordionItem, modalStore } from "@skeletonlabs/skeleton";
    import type { User } from "lucia-auth";

    export let data;

    $: currentFriend = $friends.find((u) => u.id === data.friendId);

    let query = "";
    let selectedFriends: User[] = [];

    function handleSearch() {
        const params = new URLSearchParams({ query, friendId: data.friendId ?? "" });
        goto(`?${params}`);
    }

    function friendsFilterQuery(friends: User[], query: string) {
        return friends.reduce<User[]>((prev, user) => {
            if (
                query.length === 0 &&
                user.da.includes(query) &&
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
            ) {
                return [user, ...prev];
            }
            return [...prev, user];
        }, []);
    }

    // Generates the search params that redirects to the user's schedule
    $: getFriendUrl = (friend: User) => {
        const params = new URLSearchParams($page.url.searchParams);
        params.set("friendId", friend.id.toString());
        params.delete("commonSchedule");
        params.delete("groupId");
        return `?${params}`;
    };

    // Generates the search params that redirects to the user's schedule
    $: getGroupUrl = (group: Group) => {
        const params = new URLSearchParams($page.url.searchParams);
        params.delete("friendId");
        params.delete("commonSchedule");
        params.set("groupId", group.id.toString());
        return `?${params}`;
    };

    // Generates the search params that redirects to the common schedule between the user and a friend
    $: getCommonScheduleUrl = (friend: User) => {
        const params = new URLSearchParams($page.url.searchParams);
        params.delete("friendId");
        params.delete("groupId");
        params.set("friendId", friend.id.toString());
        params.set("commonSchedule", "commonSchedule");
        return `?${params}`;
    };
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<div class="bg-surface-100-800-token sticky top-0 z-50 pb-4">
    <div class="mx-auto max-w-xl px-4 sm:w-3/5 sm:px-0">
        <SearchBar bind:query {handleSearch} placeholder="Rechercher un da, un nom..." />
    </div>
</div>

<div class="grid flex-grow grid-cols-[20rem_1fr_20rem] mx-4 overflow-x-scroll">
    <div class="flex flex-col p-4">
        <h2 class="h4 text-center">Vos amis</h2>

        <nav class="list-nav">
            <ul class="flex-grow flex-col gap-4 py-4">
                {#each friendsFilterQuery($friends, query) as friend}
                    <li>
                        <a href={getFriendUrl(friend)} class="btn flex justify-start">
                            <input
                                type="checkbox"
                                class="checkbox"
                                value={friend}
                                bind:group={selectedFriends}
                                on:click|stopPropagation={() => {}}
                            />

                            <UserCard user={friend} />
                        </a>
                    </li>
                {/each}

                {#each $groups as group}
                    <li>
                        <a href={getGroupUrl(group)} class="btn flex justify-start">
                            <div class="flex flex-col justify-around items-start">
                                <span>{group.name}</span>
                                <small class="opacity-50"> {group.usersId.length} personnes</small>
                            </div>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>

        {#if selectedFriends.length >= 2}
            <button
                class="btn variant-filled-secondary my-4"
                on:click={() => {
                    groups.create(selectedFriends);
                    selectedFriends = [];
                }}
            >
                Créer un groupe
            </button>
        {/if}

        <button
            class="btn variant-filled-primary"
            on:click={() => modalStore.trigger({ type: "component", component: "add-friend" })}
        >
            Ajouter un ami
        </button>
    </div>

    {#await data.streamed.schedule}
        <div class="grid justify-center items-center">
            <Loader />
        </div>
    {:then schedule}
        {#if schedule}
            <ScheduleView schedule={scheduleFromJson(schedule)} />
        {:else}
            <div class="p-4">Affichage de l'horaire commun</div>
        {/if}
    {/await}

    <section class="flex flex-col m-4">
        {#if currentFriend}
            <div class="w-24 h-24 mx-auto">
                <Avatar seed={currentFriend.avatar} />
            </div>

            <div class="card flex flex-col p-4 gap-4">
                <div>
                    <h4 class="h4">{currentFriend.firstName} {currentFriend.lastName}</h4>
                    <span class="opacity-70">{currentFriend.email}</span>
                </div>

                <Accordion>
                    <AccordionItem>
                        <svelte:fragment slot="summary">Groupes en commun</svelte:fragment>
                        <svelte:fragment slot="content">TODO</svelte:fragment>
                    </AccordionItem>

                    <AccordionItem>
                        <svelte:fragment slot="summary">Plus d'actions</svelte:fragment>

                        <div slot="content" class="grid">
                            <button
                                class="btn variant-ghost-error"
                                on:click={() => currentFriend && friends.remove(currentFriend.id)}
                            >
                                Retirer l'ami
                            </button>
                        </div>
                    </AccordionItem>
                </Accordion>

                <button
                    class="btn variant-filled-primary"
                    on:click={() => currentFriend && goto(getCommonScheduleUrl(currentFriend))}
                >
                    Disponibilités communes
                </button>
            </div>
        {:else}
            {#await data.streamed.group then group}
                {#if group}
                    <div class="flex flex-col m-4">
                        <h4 class="h4">{group.name}</h4>

                        <div class="card flex flex-col p-4 gap-4">
                            <h5 class="h5">Membres</h5>
                            <ul class="flex flex-col gap-2">
                                {#each group.users as user}
                                    <li>
                                        <UserCard {user} />
                                    </li>
                                {/each}
                            </ul>

                            <Accordion>
                                <AccordionItem>
                                    <svelte:fragment slot="summary">Plus d'actions</svelte:fragment>

                                    <div slot="content" class="grid gap-2">
                                        <button
                                            class="btn variant-ghost-secondary"
                                            on:click={() => groups.rename(group)}
                                        >
                                            Renommer le groupe
                                        </button>

                                        <button
                                            class="btn variant-ghost-error"
                                            on:click={() => groups.quit(group)}
                                        >
                                            Quitter le groupe
                                        </button>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                {/if}
            {/await}
        {/if}
    </section>
</div>
