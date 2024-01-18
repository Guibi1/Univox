<script lang="ts">
    import { invalidate } from "$app/navigation";
    import type { Book } from "$lib/types";
    import Carousel from "$lib/components/Carousel.svelte";
    import { api } from "sveltekit-typesafe-api";

    export let book: Book;
    export let isDeletable: boolean = false;
    export let sellerMail: string = "";

    async function deleteBook() {
        const { success } = await (
            await api.DELETE("/api/books/[bookId]", { routeParams: { bookId: book.id } })
        ).json();
        if (success) invalidate("books");
    }
</script>

<div class="flex flex-col items-center">
    <Carousel images={book.image ? [book.image] : undefined} readOnly />

    <div class="grid grid-cols-[4fr_0px] gap-2">
        <div class="flex flex-col items-center">
            <span>
                <span class="text-xl font-bold">{book.title}</span>
                <span class="font-bold italic">de {book.author}</span>
            </span>

            <span>
                Pour le cours
                <span class="underline">{book.code}</span>
            </span>

            <span>{book.state}</span>

            <span>En vente pour {book.price} $</span>

            <span>ISBN : {book.isbn}</span>

            {#if !isDeletable}
                <a href="mailto:{sellerMail}" class="filled"> Contacter </a>
            {/if}
        </div>

        {#if isDeletable}
            <button
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-900"
                on:click={deleteBook}
            >
                <i class="bx bx-trash" />
            </button>
        {/if}
    </div>
</div>
