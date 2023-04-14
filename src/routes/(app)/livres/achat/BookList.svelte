<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Book } from "$lib/Types";

    export let books: Book[];

    function openBook(book: Book) {
        goto(`?bookId=${book._id}`);
    }
</script>

<ul class="flex flex-col">
    {#each books as book}
        <li
            class="grid cursor-pointer grid-cols-[8rem_1fr_5rem] grid-rows-[min-content_min-content_1fr_min-content] gap-x-6 border-b-2 border-neutral-300 p-6"
            on:click={() => openBook(book)}
            on:keypress={() => openBook(book)}
        >
            <img
                src={book.src[0]}
                class="row-span-full max-h-[12rem] w-full object-cover"
                alt="Couverture du livre"
            />

            <span class="flex flex-col justify-between">
                <b>{book.title}</b>
            </span>

            <span class="col-start-3 row-span-3 text-right text-lg">
                {book.price.toLocaleString("fr-ca", {
                    style: "currency",
                    currency: "CAD",
                })}
            </span>

            <span class="italic">
                <small>de</small>
                {book.author}</span
            >

            <span class="py-2">{book.state}</span>

            <small class="italic">ISBN: {book.ISBN}</small>

            <a href={`?bookId=${book._id}`} class="text-right">Détails ></a>
        </li>
    {/each}
</ul>
