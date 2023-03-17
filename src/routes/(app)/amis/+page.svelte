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

<!-- <div
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

    
    <a
    href=amis/ajouter-ami
    >
        Ajouter des amis
        
    </a>
</div> -->

<div
    class="top-0 z-50 p-6 grid grid-cols-2 gap-2 grid-justify-item-stretch border-b bg-white dark:bg-neutral-900 dark:border-neutral-500"
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
            class="w-full h-12 rounded-lg text-lg "
        />

        <div ><box-icon
            name="search-alt"
            class="col-start-1 col-end-3 w-10 h-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
        
    </div>
    

    <a class="col-start-3"
    href=/amis/ajouter-ami
    >
        Ajouter un ami
        
    </a>

    </div>

<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

<ul>
    {#each $friends as ami}
        <li>
            <div class="flex items-end">{ami.lastName + ", " + ami.firstName}
                
                <box-icon
                id="friend-option-menu"
                data-dropdown-toggle="dropdown"
                name="dots-vertical-rounded"
                class="self-baseline w-6 pb-0 cursor-pointer"
            />

            </div>

            
            
            
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

<!-- TODO: faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + pouvoir enlever des amis + faire des menus déroulants pour les options d'amis + régler le bazar quand on rapetisse la page -->
