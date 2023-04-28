<script lang="ts">
    import { NotificationKind, type User } from "$lib/Types";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Option from "$lib/components/Option.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import { scheduleFromJson } from "$lib/sanitization";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import type { PageData } from "./$types";

    export let data: PageData;

    let selectedFriends: User[] = [];

    let query = "";
    let searchResults: { user: User; friendRequestSent: boolean }[] | null = null;

    async function handleSearch() {
        searchResults =
            query.length === 0 ? null : await (await fetch("/api/search/users/" + query)).json();
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
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<div class="grid flex-grow grid-cols-[1fr_1fr_2fr] divide-x overflow-hidden">
    <div class="flex flex-col p-4">
        <h2 class="mb-4 border-b border-black dark:border-white">Vos amis</h2>

        <div class="flex flex-row items-center gap-3">
            <SearchBar bind:query {handleSearch} reactiveSearch />

            <i
                class="bx bx-search-alt h-10 w-10 cursor-pointer text-4xl"
                on:click={handleSearch}
                on:keypress={handleSearch}
            />
        </div>

        <ul class="flex-grow py-4">
            {#each friendsFilterQuery($friends, query) as ami}
                <li>
                    <div
                        class="flex items-center justify-between rounded-md bg-gray-200 px-4 dark:bg-gray-400"
                    >
                        <input type="checkbox" bind:group={selectedFriends} value={ami} />

                        <span>
                            <a
                                href="?id={ami._id}"
                                class="transition-[color] duration-300 ease-in-out dark:text-white"
                                >{ami.firstName}
                                {ami.lastName}</a
                            >
                        </span>

                        <Dropdown>
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
                    </div>
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
                    {#each searchResults as result}
                        <div class="flex items-center justify-between">
                            {result.user.firstName}
                            {result.user.lastName}
                            <i>
                                {result.user.da}
                            </i>

                            {#if result.friendRequestSent}
                                <button class="filled">Demande envoyée</button>
                            {:else}
                                <button
                                    class="filled"
                                    on:click={() => {
                                        query = "";
                                        searchResults = [];
                                        notifications.create(
                                            NotificationKind.FriendRequest,
                                            result.user._id
                                        );
                                    }}
                                >
                                    Ajouter en ami
                                </button>
                            {/if}
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
                    <div class="flex items-center rounded-md bg-gray-200 px-4 dark:bg-gray-400">
                        {group.name}
                    </div>
                </li>
            {/each}
        </ul>
    </div>

    {#if data.schedule}
        <ScheduleView schedule={scheduleFromJson(data.schedule)} />
    {:else}
        <div class="p-4">Affichage de l'horaire commun</div>
    {/if}
</div>
