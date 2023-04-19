<script lang="ts">
    import { NotificationKind, type User } from "$lib/Types";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Option from "$lib/components/Option.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import type { PageData } from "./$types";

    export let data: PageData;

    let selectedFriends: User[] = [];

    let query = "";
    let searchResults: User[] | null = null;

    async function handleSearch() {
        searchResults =
            query.length === 0 ? null : await (await fetch("/api/search/users/" + query)).json();
    }

    function friendsFilterQuery(user: User, query: string) {
        if (query.length === 0) return true;
        if (user.da.includes(query)) return true;
        if (`${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase()))
            return true;
        return false;
    }
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<div
    class="flex flex-col items-center gap-4 border-b border-black bg-white p-4 dark:border-neutral-500 dark:bg-neutral-900"
>
    <h1>Mes Amis</h1>

    <div class="col-span-2 flex w-1/2 flex-row items-center gap-3">
        <SearchBar bind:query {handleSearch} />

        <i
            class="bx bx-search-alt h-10 w-10 cursor-pointer text-4xl"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
</div>

<div class="grid flex-grow grid-cols-4 divide-x">
    <div class="flex flex-col p-4">
        <h2 class="mb-4 border-b border-black dark:border-white">Vos amis</h2>

        <ul class="flex-grow">
            {#each $friends.filter((u) => friendsFilterQuery(u, query)) as ami}
                <li>
                    <a href="?id=${ami._id}" class="flex items-center justify-between">
                        <input type="checkbox" bind:group={selectedFriends} value={ami} />

                        <span>
                            {ami.firstName}
                            {ami.lastName}
                        </span>

                        <Dropdown>
                            <Option
                                text="Consulter l'horaire"
                                onClick={() => console.log("TODO: afficher l'horaire")}
                            />
                            <Option
                                text="Horaire commun"
                                onClick={() => console.log("TODO: afficher l'horaire")}
                            />
                            <Option
                                separate
                                text="Retirer l'ami.e"
                                color="red"
                                onClick={() => friends.remove(ami._id)}
                            />
                        </Dropdown>
                    </a>
                </li>
            {/each}
        </ul>

        {#if selectedFriends.length >= 2}
            <div class="flex justify-center p-4">
                <button
                    class="filled"
                    on:click={() => {
                        selectedFriends = [];
                        groups.create(selectedFriends);
                    }}
                >
                    Créer un groupe
                </button>
            </div>
        {/if}

        {#if query}
            <h2 class="mb-4 border-b border-black dark:border-white">Autres utilisateurs</h2>

            {#if searchResults === null}
                Chargement en cours
            {:else if searchResults.length === 0}
                Aucun résultats
            {:else}
                <div>
                    {#each searchResults as user}
                        <div class="flex items-center justify-between">
                            {user.firstName}
                            {user.lastName}
                            <i>
                                {user.da}
                            </i>

                            <button
                                class="filled"
                                on:click={() => {
                                    query = "";
                                    searchResults = [];
                                    notifications.create(NotificationKind.FriendRequest, user._id);
                                }}
                            >
                                Ajouter en ami
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>

    <div class="p-4">
        <h2 class="mb-4 border-b border-black dark:border-white">Vos groupes</h2>

        <ul>
            {#each $groups as group}
                <li>
                    <div class="flex items-center">
                        {group.name}
                    </div>
                </li>
            {/each}
        </ul>
    </div>

    <div class="p-4">
        {#if data.schedule}
            <ScheduleView schedule={data.schedule} />
        {:else}
            Affichage de l'horaire commun
        {/if}
    </div>
</div>

<!-- TODO: groupes + régler le bazar quand on rapetisse la page -->
