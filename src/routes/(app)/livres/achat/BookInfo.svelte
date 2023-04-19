<script lang="ts">
    import type { Book } from "$lib/Types";

    export let book: Book | null = null;
</script>

{#if book}
    <div>
        {book.title}
    </div>
{:else}
    <div>Pas de livre sélectionné</div>
{/if}
