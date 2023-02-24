<script lang="ts">
    import { page } from "$app/stores";
    import type { Book } from "$lib/Types";
    import BookFilter from "./BookFilter.svelte";
    import BookList from "./BookList.svelte";

    let books: Book[] = [
        {
            id: "1",
            price: 10.0,
            author: "The holy fish",
            state: "En état de décomposition!",
            title: "The history of this horrible project!",
            ISBN: "0073545775",
            src: "https://pixy.org/src/487/4870083.jpg",
        },
        {
            id: "2",
            price: 20.99,
            author: "MAMA",
            state: "En mode correct",
            title: "Joe",
            ISBN: "978-0-07-354577-6",
            src: "https://www.pixelstalk.net/wp-content/uploads/2016/06/Free-Download-HD-Country-Image.jpg",
        },
        {
            id: "2",
            price: 20.99,
            author: "MAMA",
            state: "En mode correct",
            title: "Joe",
            ISBN: "978-0-07-354577-6",
            src: "https://www.pixelstalk.net/wp-content/uploads/2016/06/Free-Download-HD-Country-Image.jpg",
        },
        {
            id: "2",
            price: 20.99,
            author: "MAMA",
            state: "En mode correct",
            title: "Joe",
            ISBN: "978-0-07-354577-6",
            src: "https://www.pixelstalk.net/wp-content/uploads/2016/06/Free-Download-HD-Country-Image.jpg",
        },
        {
            id: "2",
            price: 20.99,
            author: "MAMA",
            state: "En mode correct",
            title: "Joe",
            ISBN: "978-0-07-354577-6",
            src: "https://www.pixelstalk.net/wp-content/uploads/2016/06/Free-Download-HD-Country-Image.jpg",
        },
    ];
    let filters: string[] = ["matière 1", "matière 2", "AAAAAAAAAAAAAAAAAaa", "A"];

    let bookId: string | null;
    $: bookId = $page.url.searchParams.get("bookId");

    function handleSearch() {
        console.log("Searching!");
    }
</script>

<svelte:head>
    <title> Univox | Livres | Achat </title>
</svelte:head>

<h1 class="text-center pt-2 dark:bg-neutral-900">Acheter des livres</h1>

<div
    class="sticky top-0 z-50 p-6 flex justify-center border-b bg-white dark:bg-neutral-900 dark:border-neutral-500"
>
    <div class="w-1/2 flex flex-row gap-3 items-center ml-10">
        <input
            type="text"
            on:keypress={(e) => {
                if (e.key == "Enter") handleSearch();
            }}
            placeholder="Rechercher"
            class="w-full h-12 rounded-lg text-lg"
        />

        <box-icon
            name="search-alt"
            class="w-10 h-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
</div>

<main class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8">
    <BookFilter bind:filters />

    <BookList {books} />

    <div>{bookId}</div>
</main>
