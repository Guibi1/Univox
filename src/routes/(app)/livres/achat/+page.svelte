<script lang="ts">
    import { page } from "$app/stores";
    import BookFilter from "./BookFilter.svelte";
    import BookList from "./BookList.svelte";

    let books: Book[] = [
        {
            id: "1",
            price: 10.0,
            author: "The holy fish",
            etat: "En état de décomposition!",
            title: "The history of this horrible project!",
        },
        {
            id: "2",
            price: 20.99,
            author: "MAMA",
            etat: "En mode correct",
            title: "Joe",
        },
    ];
    let filters: string[] = ["matière 1", "matière 2", "AAAAAAAAAAAAAAAAAaa", "A"];

    let bookId: string | null;
    $: bookId = $page.url.searchParams.get("bookId");
</script>

<div>
    <h1 class="text-center">Achat</h1>

    <main class="grid grid-cols-3 gap-4 p-6">
        <BookFilter bind:filters />

        <BookList {books} />

        <div>{bookId}</div>
    </main>
</div>
