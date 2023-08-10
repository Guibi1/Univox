<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import BookFilter from "./BookFilter.svelte";

    export let data;

    let query = $page.url.searchParams.get("query") ?? "";
    let selectedCodes: string[] = $page.url.searchParams.getAll("codes");

    function handleSearch() {
        const params = new URLSearchParams({ query });
        for (let code of selectedCodes) {
            params.append("codes", code);
        }
        goto(`/livres?${params}`);
    }
</script>

<main class="flex gap-8 p-8">
    <div class="flex flex-col gap-4 w-64">
        <h1 class="h3">Rechercher</h1>

        <SearchBar bind:query {handleSearch} placeholder="Rechercher" />

        <BookFilter bind:selectedCodes codes={data.bookCodes} />

        <button on:click={handleSearch} class="btn variant-filled-primary">Rechercher</button>
    </div>

    <div class="flex-grow">
        <slot />
    </div>
</main>
