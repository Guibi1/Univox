<script lang="ts">
    import BookFilter from "./BookFilter.svelte";
    import BookList from "./BookList.svelte";

    let books: Book[] = [
        {
            id: "1",
            price: 10,
            author: "Your mom",
            description: "This is a good book",
            title: "Book!",
        },
    ];
    let filters: any = {};
    console.log("🚀 ~ file: +layout.svelte:7 ~ filters", filters);
</script>

<div>
    <h1 class="text-center">Achat</h1>

    <main class="grid grid-cols-3 gap-4 p-6">
        <BookFilter bind:filters />

        <BookList {books} />

        <slot />
    </main>
</div>
