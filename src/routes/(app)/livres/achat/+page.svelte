<script lang="ts">
    import { page } from "$app/stores";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import type { Book } from "$lib/Types";
    import type { PageData } from "./$types";
    import BookFilter from "./BookFilter.svelte";
    import BookInfo from "./BookInfo.svelte";
    import BookList from "./BookList.svelte";

    export let data: PageData;

    let books: Book[] = [];
    let codes: string[] = [];
    let query = "";

    let bookId: string | null;
    $: bookId = $page.url.searchParams.get("bookId");

    async function handleSearch() {
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
    <title>Univox | Livres</title>
</svelte:head>

<h1 class="pt-2 text-center dark:bg-neutral-900">Acheter des livres</h1>

<div
    class="sticky top-0 z-50 flex justify-center border-b bg-white p-6 dark:border-neutral-500 dark:bg-neutral-900"
>
    <div class="ml-10 flex w-1/2 flex-row items-center gap-3">
        <SearchBar bind:query {handleSearch} />

        <i
            class="bx bx-search-alt h-10 w-10 cursor-pointer text-4xl"
            on:click={handleSearch}
            on:keypress={handleSearch}
        />
    </div>
</div>

<main class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8">
    <BookFilter bind:codes onChange={handleSearch} />

    <BookList {books} />

    <BookInfo book={data.book} />
</main>
