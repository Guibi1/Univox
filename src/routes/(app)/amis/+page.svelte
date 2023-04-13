<script lang="ts">
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Option from "$lib/components/Option.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
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

<!-- class="sticky top-0 z-50 flex justify-center border-b bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900" -->

<div
    class="grid grid-cols-3 border-b border-black bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900"
>
    <!-- class="ml-10 flex w-1/2 flex-row items-center gap-3" -->

    <div class="col-span-2 flex w-1/2 flex-row items-center gap-3">
        <SearchBar bind:query {handleSearch} />

        <box-icon
            name="search-alt"
            class="h-10 w-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>

    <div class="justify-self-end">
        <div><a href="/amis/ajouter-ami"> Ajouter des amis </a></div>
        <button>Créer un groupe</button>
        <!-- À faire -->
    </div>
</div>

<div class="grid h-full grid-cols-4">
    <ul class="border-r border-black px-5 dark:border-white">
        <p class="mb-4 border-b border-black text-xl font-bold dark:border-white">Vos amis</p>
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

    <ul class="border-r border-black px-5 dark:border-white">
        <p class="mb-4 border-b border-black text-xl font-bold dark:border-white">Vos groupes</p>

        {#each $groups as group}
            <li>
                <div class="flex items-center">
                    {group.name}
                </div>
            </li>
        {/each}
    </ul>

    <div class="col-start-3 col-end-5 justify-self-center">Affichage de l'horaire commun</div>
</div>

<!-- TODO: groupes + faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + régler le bazar quand on rapetisse la page -->
