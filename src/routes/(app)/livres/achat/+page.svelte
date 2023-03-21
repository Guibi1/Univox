<script lang="ts">
    import { page } from "$app/stores";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import type { Book } from "$lib/Types";
    import BookFilter from "./BookFilter.svelte";
    import BookInfo from "./BookInfo.svelte";
    import BookList from "./BookList.svelte";

    let books: Book[] = [];
    let codes: string[] = [];

    let bookId: string | null;
    $: bookId = $page.url.searchParams.get("bookId");

    async function handleSearch(query: string) {
        books = await (
            await fetch("/api/search/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, codes }),
            })
        ).json();
    }
</script>

<svelte:head>
    <title>Univox | Livres | Achat</title>
</svelte:head>

<h1 class="pt-2 text-center dark:bg-neutral-900">Acheter des livres</h1>

<div
    class="sticky top-0 z-50 flex justify-center border-b bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900"
>
    <div class="ml-10 flex w-1/2 flex-row items-center gap-3">
        <SearchBar {handleSearch} />

        <box-icon
            name="search-alt"
            class="h-10 w-10 cursor-pointer"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
</div>

<main class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8">
    <BookFilter bind:codes onchange={handleSearch} />

    <BookList {books} />

    <BookInfo {bookId} />
</main>
