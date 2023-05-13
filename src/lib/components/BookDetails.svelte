<script lang="ts">
    import type { Book } from "$lib/Types";
    import Carousel from "$lib/components/Carousel.svelte";
    import type { PageData } from "../../routes/(app)/livres/$types";
    export let book: Book | null = null;
    export let isDeletable: boolean = false;
    export let sellerMail: String;
</script>

<div class="flex flex-col items-center">
    {#if book}
        <Carousel images={book.src} readOnly />
        <div class="grid grid-cols-[4fr_0px] gap-2">
            <div class="flex flex-col items-center">
                <span>
                    <span class="text-xl font-bold">
                        {book.title}
                    </span>
                    <span class="font-bold italic">
                        de {book.author}
                    </span>
                </span>

                <span>
                    Pour
                    <span class="underline">
                        {book.code}
                    </span>
                </span>

                <span>
                    Est {book.state}
                </span>

                <span>
                    En vente pour {book.price} $
                </span>

                <span>
                    ISBN : {book.ISBN}
                </span>
                {#if !isDeletable}
                    <a href="mailto:{sellerMail}" class="filled"> Contacter </a>
                {/if}
            </div>
            {#if isDeletable}
                <span>
                    <button
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-900"
                    >
                        <i class="bx bx-trash" />
                    </button>
                </span>
            {/if}
        </div>
    {:else}
        <span>Pas de livre sélectionné</span>
    {/if}
</div>
