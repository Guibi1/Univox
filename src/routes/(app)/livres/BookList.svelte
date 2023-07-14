<script lang="ts">
    import { page } from "$app/stores";
    import type { Book } from "$lib/types";

    export let books: Book[];

    // Generates the search params that redirects to the book's details
    $: getBookUrl = (book: Book) => {
        const params = new URLSearchParams($page.url.searchParams);
        params.set("bookId", book.id.toString());
        return `?${params}`;
    };
</script>

<ul class="flex flex-col divide-y">
    {#each books as book}
        <li>
            <a
                href={getBookUrl(book)}
                class="grid cursor-pointer grid-cols-[8rem_1fr_5rem] grid-rows-[min-content_min-content_min-content_1fr_min-content] gap-x-6 p-6"
            >
                <img
                    src={book.image}
                    class="row-span-full h-40 w-32 rounded object-cover"
                    alt="Couverture du livre"
                />

                <span class="flex flex-col justify-between">
                    <b>{book.title}</b>
                </span>

                <span class="col-start-3 row-span-4 text-right text-lg">
                    {book.price} $
                </span>

                <span class="italic">
                    <small>de</small>
                    {book.author}</span
                >

                <span class="py-2">{book.state}</span>

                <span class="py-2">Pour le cours {book.code}</span>

                <small class="italic">ISBN: {book.isbn}</small>

                <a href={getBookUrl(book)} class="text-right">Détails ></a>
            </a>
        </li>
    {/each}
</ul>
