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
    <title>Univox | Amis</title>
</svelte:head>

<h1 class="text-center pt-2 dark:bg-neutral-900">Amis</h1>

<div
    class="sticky top-0 z-50 p-6 flex justify-center border-b bg-white dark:bg-neutral-900 dark:border-neutral-500"
>
    <div class="w-1/2 flex flex-row gap-3 items-center ml-10">
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

        <box-icon
            name="search-alt"
            class="w-10 h-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
</div>

<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

<ul>
    {#each $friends as ami}
        <li>
            {ami.lastName + ", " + ami.firstName}
            <button
                on:click={() => {
                    query = "";
                    searchResults = [];
                    friends.remove(ami._id);
                }}
            >
                retirer ami
            </button>
        </li>
    {/each}
</ul>

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
                ajouter en ami
            </button>
        
    </div>
{/each}

<!-- TODO: faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + pouvoir enlever des amis -->
