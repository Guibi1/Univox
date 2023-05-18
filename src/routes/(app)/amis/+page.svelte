<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
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
        params.delete("commonSchedule");
        params.delete("groupId");
        return `?${params}`;
    };

    // Generates the search params that redirects to the common schedule between the user and a friend
    $: getCommonScheduleUrl = (friend: User) => {
        const params = new URLSearchParams($page.url.searchParams);
        params.delete("friendId");
        params.delete("groupId");
        params.set("friendId", friend._id.toString());
        params.set("commonSchedule", "commonSchedule");
        return `?${params}`;
    };
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>


<div class="grid flex-grow grid-cols-[4fr_3fr] divide-x-4 divide-black overflow-x-scroll">
    <div class="flex flex-col space-y-3">
        <div class="flex flex-row items-center gap-4">
            <SearchBar bind:query {handleSearch} />

            <i
                class="bx bx-search-alt h-10 w-10 cursor-pointer text-4xl"
                on:click={handleSearch}
                on:keypress={handleSearch}
            />
        </div>
    <div class="grid flex-grow grid-cols-[1fr_1fr] divide-x-4 divide-black">
        <div class="flex flex-col p-4">
            <h2 class="mb-4 self-center">Vos amis</h2>
    
            
    
            <ul class="flex flex-grow flex-col gap-4 py-4">
                {#each friendsFilterQuery($friends, query) as friend}
                    <li>
                        <div
                            class="flex items-center justify-between rounded-md px-4"
                        >
                        <div class="flex items-center">
                            <input type="checkbox" bind:group={selectedFriends} value={friend} />
                            <div class="flex flex-row gap-2 px-3">
                                    <div class=" h-16 w-16 rounded-full">
                                        <Avatar seed={friend.avatar} />
                                    </div>
                                    <div class="flex flex-col">
                                        <div>{friend.lastName + ", " + friend.firstName}</div>
                                        <div class="text-sm text-gray-500">{friend.email}</div>
                                    </div>
                                    <Dropdown>
                                        <Option
                                            text="Horaire libre commun"
                                            href={getCommonScheduleUrl(friend)}
                                        />
                                        <Option
                                            separate
                                            text="Retirer l'ami.e"
                                            color="red"
                                            onClick={() => friends.remove(friend._id)}
                                        />
                                    </Dropdown>
                                </div>
                        </div>
                            <div class="flex flex-row justify-between">
                                
                                <div class="flex flex-row items-center gap-3 px-5">
                                    <a class="filled h-10 w-24" href={getFriendUrl(friend)}>
                                        Horaire
                                    </a>
                                </div>
                            </div>
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
                    {#each data.searchResults as result}
                        <div
                            class="flex items-center justify-between gap-4 rounded-lg"
                        >
                            <div class="flex flex-col gap-4">
                                <span>
                                    {result.user.firstName}
                                    {result.user.lastName}
                                </span>
                                <small>
                                    {result.user.email}
                                </small>
                            </div>
    
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
                {/if}
            {/if}
        </div>
    
        <div class="flex flex-col p-4">
            <h2 class="self-center mb-4">Vos groupes</h2>
    
            <ul class="flex flex-col gap-4">
                {#each $groups as group}
                    <li class="items-center rounded-md px-4">
                        <GroupElement {group} />
                    </li>
                {/each}
            </ul>
        </div>
    </div>
    </div>

    {#if data.groupSchedule}
        <ScheduleView schedule={scheduleFromJson(data.groupSchedule)} />
    {:else if data.friendSchedule}
        <ScheduleView schedule={scheduleFromJson(data.friendSchedule)} />
    {:else if data.friendCommonSchedule}
        <ScheduleView schedule={scheduleFromJson(data.friendCommonSchedule)} />
    {:else}
        <div class="p-4">Affichage de l'horaire commun</div>
    {/if}
</div>
