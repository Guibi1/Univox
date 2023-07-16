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
        const params = new URLSearchParams({ query, bookId: data.bookId.toString() });
        for (let code of selectedCodes) {
            params.append("codes", code);
        }
        goto(`?${params}`);
    }
</script>

<svelte:head>
    <title>Univox | Livres</title>
</svelte:head>

<div class="bg-surface-100-800-token sticky top-0 z-50 pb-4">
    <div class="mx-auto max-w-xl px-4 sm:w-3/5 sm:px-0">
        <SearchBar bind:query {handleSearch} placeholder="Rechercher un livre..." />
    </div>
</div>

<main class="grid grid-cols-[1fr_4fr_2fr] items-start gap-8 p-8">
    <BookFilter bind:selectedCodes onChange={handleSearch} codes={data.bookCodes} />

    <BookList books={data.searchResults} />

    <BookDetails book={data.selectedBook} sellerMail={data.selectedBookUser?.email ?? ""} />
</main>
