<script lang="ts">
    import BookDetails from "$lib/components/BookDetails.svelte";

    export let data;
</script>

<svelte:head>
    <title>Univox | Mes livres</title>
</svelte:head>

<div>
    <h1 class="text-center">Mes livres</h1>
    <div class="grid grid-cols-2 gap-4">
        {#each data.books as book}
            <BookDetails {book} />
        {/each}
    </div>
</div>
