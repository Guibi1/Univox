<script lang="ts" async>
    import SearchBar from "$lib/components/SearchBar.svelte";
    import friends from "$lib/stores/friends";
    import type { User } from "$lib/Types";

    let query = "";
    let searchResults: User[] = [];

    async function handleSearch(query: string) {
        searchResults =
            query.length > 3 ? await (await fetch("/api/search/users/" + query)).json() : [];
    }
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<h1 class="pt-2 text-center dark:bg-neutral-900">Amis</h1>

<div
    class="sticky top-0 z-50 flex justify-center border-b bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900"
>
    <div class="ml-10 flex w-1/2 flex-row items-center gap-3">
        <SearchBar bind:query {handleSearch} />

        <box-icon
            name="search-alt"
            class="h-10 w-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
</div>

<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

{#each $friends as ami, i}
    <div>
        {ami.lastName}{i}
    </div>
{/each}

{#each searchResults as user}
    <div>
        {user.firstName}
        <button
            on:click={() => {
                query = "";
                searchResults = [];
                friends.add(user._id);
            }}
        >
            add
        </button>
    </div>
{/each}

<!-- TODO: faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + pouvoir enlever des amis -->
