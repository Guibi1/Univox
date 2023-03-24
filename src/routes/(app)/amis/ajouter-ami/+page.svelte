<script lang="ts" async>
    import friends from "$lib/stores/friends";
    import type { User } from "$lib/Types";

    let query = "";
    let searchResults: User[] = [];

    async function handleSearch() {
        searchResults =
            query.length > 3 ? await (await fetch("/api/search/users/" + query)).json() : [];
    }

    let timeout: NodeJS.Timeout | null;
    function timedSearch() {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            handleSearch();
        }, 500);
    }
</script>

<svelte:head>
    <title>Univox | Ajouter des amis</title>
</svelte:head>

<h1 class="text-center pt-2 dark:bg-neutral-900">Ajouter des amis</h1>

<div
    class="top-0 z-50 p-6 grid grid-cols-3 gap-2 grid-justify-item-stretch border-b bg-white dark:bg-neutral-900 dark:border-neutral-500"
> <!-- "sticky top-0 z-50 p-6 flex justify-center border-b bg-white dark:bg-neutral-900 dark:border-neutral-500" -->
    <div class="grid grid-cols-2 gap-2 grid-justify-item-strech w-[1024px]"> <!-- "w-1/2 flex flex-row gap-3 items-center ml-10" -->
        <input
            type="text"
            bind:value={query}
            on:keypress={(e) => {
                if (e.key == "Enter") handleSearch();
            }}
            on:input={timedSearch}
            placeholder="Rechercher"
            class="w-full h-12 rounded-lg text-lg"
        />

        <div ><box-icon
            name="search-alt"
            class="col-start-1 col-end-3 w-10 h-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
        
    </div>
    

    <a class="col-start-4"
    href=/amis
    >
        Liste d'amis
        
    </a>
</div>

<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

{#each searchResults as user}
    <div>
        {user.lastName + ", " + user.firstName}
        
            <button class="filled"
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
