<script lang="ts">
    import type { Book } from "$lib/Types";
    import Carousel from "$lib/components/Carousel.svelte";

    export let book: Book | null = null;
</script>

<div class="flex flex-col justify-center">
    {#if book}
        <Carousel images={book.src} readOnly />

        <div>
            <h3>
                {book.title}
            </h3>
        </div>
    {:else}
        <span>Pas de livre sélectionné</span>
    {/if}
</div>
