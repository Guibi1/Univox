<script lang="ts">
    import SearchBar from "$lib/components/SearchBar.svelte";
    import friends from "$lib/stores/friends";
    import type { User } from "$lib/Types";

    let query = "";
    let searchResults: User[] = [];

    async function handleSearch() {
        searchResults =
            query.length > 3 ? await (await fetch("/api/search/users/" + query)).json() : [];
    }
</script>

<svelte:head>
    <title>Univox | Ajouter des amis</title>
</svelte:head>

<h1 class="pt-2 text-center dark:bg-neutral-900">Ajouter des amis</h1>

<div
    class="sticky top-0 z-50 flex justify-center border-b bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900"
>
    <div class="ml-10 flex w-1/2 flex-row items-center gap-3">
        <SearchBar bind:query {handleSearch} />

        <i
            name="search-alt"
            class="h-10 w-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>

    <a href="/amis"> Liste d'amis </a>
</div>

{#each searchResults as user}
    <div>
        {user.lastName + ", " + user.firstName}

        <button
            class="filled"
            on:click={() => {
                query = "";
                searchResults = [];
                friends.add(user._id);
            }}
        >
            ajouter en ami
        </button>
    </div>
{/each}
