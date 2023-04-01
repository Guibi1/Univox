<script lang="ts">
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Option from "$lib/components/Option.svelte";
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
    <title>Univox | Amis</title>
</svelte:head>

<h1 class="pt-2 text-center dark:bg-neutral-900">Amis</h1>

<div
    class="sticky top-0 z-50 flex justify-center border-b bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900"
>
    <div class="ml-10 flex w-1/2 flex-row items-center gap-3">
        <SearchBar bind:query {handleSearch} />

        <i
            class="bx bx-search-alt h-10 w-10 cursor-pointer text-4xl"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>

    <a href="/amis/ajouter-ami"> Ajouter des amis </a>
</div>

<ul>
    {#each searchResults as user}
        <div>
            {user.lastName + ", " + user.firstName}
        </div>
    {/each}

    {#each $friends as ami}
        <li>
            <div class="flex items-center">
                {ami.lastName + ", " + ami.firstName}
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
            </div>
        </li>
    {/each}
</ul>

<!-- TODO: faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + pouvoir enlever des amis + faire des menus déroulants pour les options d'amis + régler le bazar quand on rapetisse la page -->
