<script lang="ts">
    import { goto } from "$app/navigation";
    import BookDetails from "$lib/components/BookDetails.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import BookFilter from "./BookFilter.svelte";
    import BookList from "./BookList.svelte";

    export let data;

    let query = data.query;
    let selectedCodes = data.selectedCodes;

    function handleSearch() {
        const params = new URLSearchParams({ query, bookId: data.bookId });
        for (let code of selectedCodes) {
            params.append("codes", code);
        }
        goto(`?${params}`);
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

<main class="grid grid-cols-[1fr_4fr_2fr] items-start gap-8 p-8">
    <BookFilter bind:selectedCodes onChange={handleSearch} codes={data.bookCodes} />

    <BookList books={data.searchResults} />

    <BookDetails book={data.selectedBook} sellerMail={data.selectedBookUser?.email ?? ""} />
</main>
