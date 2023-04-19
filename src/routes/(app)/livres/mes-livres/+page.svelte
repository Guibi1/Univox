<script lang="ts">
    import BookDetails from "$lib/components/BookDetails.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>Univox | Mes livres</title>
</svelte:head>

<div>
    <h1 class="text-center">Mes livres</h1>

    {#each data.books as book}
        <BookDetails {book} />
    {/each}
</div>
