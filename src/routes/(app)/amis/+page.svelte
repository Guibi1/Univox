<script lang="ts" async>
    import type { User } from "$lib/Types";
    import { onMount } from "svelte";

    let amis: User[] = [];

    onMount(async () => (amis = await (await fetch("/api/user/friends")).json()));

    function handleSearch() {
        console.log("Searching!");
    }
</script>

<h1 class="text-center pt-2 dark:bg-neutral-900">Amis</h1>

<div class="sticky top-0 z-50 p-6 grid grid-cols-[165px_1fr] items-strech border-b bg-white dark:bg-neutral-900 dark:border-neutral-500"> <!-- Oui, c'est du pif, mais ça marche :) -->
    <div></div>

    <div class="flex flex-row gap-3 justify-center">
        <input
            type="text"
            on:keypress={(e) => {
                if (e.key == "Enter") handleSearch();
            }}
            placeholder="Rechercher"
            class="w-1/4 h-12 rounded-lg text-lg"
        />

        <div>
            <box-icon
            name="search-alt"
            class="w-10 h-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}/>
        </div>

        <button
            on:click={() => {
                fetch("/api/user/friends", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ friendId: "63eb183ad2cdef1b1f08484c" }),
                });
            }}
        >
            ajouter un ami
        </button>
        
        
    </div>
</div>



<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

{#each amis as ami}
    {ami.lastName}
{/each}

<!-- TODO:
faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + pouvoir enlever des amis -->
