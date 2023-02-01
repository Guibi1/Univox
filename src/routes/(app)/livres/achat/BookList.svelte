<script lang="ts">
    import { goto } from "$app/navigation";

    export let books: Book[];

    function openBook(book: Book) {
        goto(`?bookId=${book.id}`);
    }
</script>

<ul>
    {#each books as book}
        <li
            class="grid p-4 bg-zinc-300 border-2 border-zinc-400 rounded-xl cursor-pointer"
            on:click={() => openBook(book)}
            on:keypress={() => openBook(book)}
        >
            <span class="flex items-baseline gap-1">
                <h3>{book.title}</h3>
                <small>de</small>
                <i>{book.author}</i>
            </span>
            <span class="row-span-2"
                >{book.price.toLocaleString("fr-ca", { style: "currency", currency: "CAD" })}</span
            >
            <span>{book.etat}</span>
        </li>
    {/each}
</ul>

<style>
    li {
        grid-template: 1fr 2fr / 1fr 5rem;
    }
</style>
