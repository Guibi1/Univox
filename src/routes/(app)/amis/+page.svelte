<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import UserCard from "$lib/components/UserCard.svelte";
    import { scheduleFromJson } from "$lib/sanitization";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import type { Group } from "$lib/types.js";
    import { Accordion, AccordionItem, modalStore } from "@skeletonlabs/skeleton";
    import type { User } from "lucia";

    export let data;

    $: currentFriend = $friends.find((u) => u.userId === data.friendId);
    $: currentGroup = $groups.find((g) => g.id === data.groupId);

    // Generates the search params that redirects to the user's schedule
    $: getFriendUrl = (friend: User) => {
        const params = new URLSearchParams();
        params.set("friendId", friend.userId);
        return `?${params}`;
    };

    // Generates the search params that redirects to the user's schedule
    $: getGroupUrl = (group: Group) => {
        const params = new URLSearchParams();
        params.set("groupId", group.id.toString());
        return `?${params}`;
    };

    // Generates the search params that redirects to the common schedule between the user and a friend
    $: getCommonScheduleUrl = (friend: User) => {
        const params = new URLSearchParams();
        params.set("friendId", friend.userId);
        params.set("commonSchedule", "");
        return `?${params}`;
    };

    const addFriend = () => modalStore.trigger({ type: "component", component: "add-friend" });
    const createGroup = () => modalStore.trigger({ type: "component", component: "create-group" });
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<div class="grid flex-grow grid-cols-[20rem_1fr_20rem] overflow-x-scroll p-6">
    <div class="flex flex-col p-4">
        <h1 class="h3">Vos amis</h1>

        <nav class="list-nav">
            <ul class="flex-grow flex-col gap-4 py-2">
                {#each $friends as friend}
                    <li>
                        <a href={getFriendUrl(friend)} class="btn flex justify-start">
                            <UserCard user={friend} />
                        </a>
                    </li>
                {/each}

                {#each $groups as group}
                    <li>
                        <a href={getGroupUrl(group)} class="btn flex justify-start">
                            <div class="flex flex-col items-start justify-around">
                                <span>{group.name}</span>
                                <small class="opacity-50"> {group.usersId.length} personnes</small>
                            </div>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>

        <button class="btn variant-filled-primary my-4" on:click={addFriend}>
            Ajouter un ami
        </button>

        <button class="btn variant-filled-primary" on:click={createGroup}> Créer un groupe </button>
    </div>

    {#await data.streamed.schedule}
        <div class="grid items-center justify-center">
            <Loader />
        </div>
    {:then schedule}
        {#if schedule}
            <ScheduleView schedule={scheduleFromJson(schedule)} />
        {:else}
            <div class="p-4">Affichage de l'horaire commun</div>
        {/if}
    {/await}

    <section class="m-4 flex flex-col">
        {#if currentFriend}
            <div class="mx-auto h-24 w-24">
                <Avatar seed={currentFriend.avatar} />
            </div>

            <div class="card flex flex-col gap-4 p-4">
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
                                on:click={() =>
                                    currentFriend && friends.remove(currentFriend.userId)}
                            >
                                Retirer l'ami
                            </button>
                        </div>
                    </AccordionItem>
                </Accordion>

                <a class="btn variant-filled-primary" href={getCommonScheduleUrl(currentFriend)}>
                    Disponibilités communes
                </a>
            </div>
        {:else if currentGroup && data.groupUsers}
            <div class="m-4 flex flex-col">
                <h4 class="h4">{currentGroup.name}</h4>

                <div class="card flex flex-col gap-4 p-4">
                    <h5 class="h5">Membres</h5>
                    <ul class="flex flex-col gap-2">
                        {#each data.groupUsers as user}
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
                                    on:click={() => currentGroup && groups.rename(currentGroup)}
                                >
                                    Renommer le groupe
                                </button>

                                <button
                                    class="btn variant-ghost-error"
                                    on:click={() => currentGroup && groups.quit(currentGroup)}
                                >
                                    Quitter le groupe
                                </button>
                            </div>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        {/if}
    </section>
</div>
