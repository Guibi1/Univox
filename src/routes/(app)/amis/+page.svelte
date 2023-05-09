<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { NotificationKind, type Group, type User, type Schedule } from "$lib/Types";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import GroupElement from "$lib/components/GroupElement.svelte";
    import Option from "$lib/components/Option.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import { scheduleFromJson } from "$lib/sanitization";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";

    export let data;

    let query = data.query ?? "";
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
        params.set("friendId", friend._id.toString());
        params.delete("groupId");
        return `?${params}`;
    };
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<div class="grid flex-grow grid-cols-[1fr_1fr_2fr] divide-x overflow-hidden">
    <div class="flex flex-col p-4">
        <h2 class="mb-4 border-b border-black dark:border-white">Vos amis</h2>

        <div class="flex flex-row items-center gap-3">
            <SearchBar bind:query {handleSearch} />

            <i
                class="bx bx-search-alt h-10 w-10 cursor-pointer text-4xl"
                on:click={handleSearch}
                on:keypress={handleSearch}
            />
        </div>

        <ul class="flex-grow py-4">
            {#each friendsFilterQuery($friends, query) as friend}
                <li>
                    <div class="flex items-center justify-between">
                        <input type="checkbox" bind:group={selectedFriends} value={friend} />

                        <span>
                            <a
                                href={getFriendUrl(friend)}
                                class="transition-[color] duration-300 ease-in-out dark:text-white dark:hover:text-blue-primary"
                            >
                                {friend.firstName}
                                {friend.lastName}
                            </a>
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
                                onClick={() => friends.remove(friend._id)}
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
                        groups.create(selectedFriends);
                        selectedFriends = [];
                    }}
                >
                    Créer un groupe
                </button>
            </div>
        {/if}

        {#if data.query}
            <h2 class="mb-4 border-b border-black dark:border-white">Autres utilisateurs</h2>

            {#if data.searchResults.length === 0}
                Aucun résultats
            {:else}
                <div>
                    {#each data.searchResults as result}
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
                                    on:click={async () => {
                                        await notifications.create(
                                            NotificationKind.FriendRequest,
                                            result.user._id
                                        );
                                        invalidate("app:notifications");
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
                    <GroupElement {group} />
                </li>
            {/each}
        </ul>
    </div>

    {#if data.groupSchedule}
        <ScheduleView schedule={scheduleFromJson(data.groupSchedule)} />
    {:else if data.friendSchedule}
        <ScheduleView schedule={scheduleFromJson(data.friendSchedule)} />
    {:else}
        <div class="p-4">Affichage de l'horaire commun</div>
    {/if}
</div>
