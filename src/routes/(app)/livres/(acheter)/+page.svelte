<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";
    import { api } from "sveltekit-api-fetch";

    export let data;

    $: books = data.streamed.books;
    $: page = data.page;
    let loadingMore = false;

    function showMore() {
        page += 1;
        loadingMore = true;
        api.GET("/api/books", {
            searchParams: {
                query: data.query,
                codes: data.selectedCodes.at(0) ?? "",
                page: page.toString(),
            },
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.success) books = books.then((books) => [...books, ...json.books]);
            })
            .finally(() => (loadingMore = false));
    }
</script>

<svelte:head>
    <title>Univox | Livres</title>
</svelte:head>

{#await books}
    <div class="flex justify-center p-10">
        <Loader />
    </div>
{:then books}
    {#if books.length}
        <ul class="flex flex-wrap justify-center gap-4">
            {#each books as book}
                <li>
                    <a
                        href={`/livres/${book.id}`}
                        class="card card-hover isolate flex w-72 flex-col overflow-hidden"
                    >
                        <div class="relative isolate -z-10 grid h-52">
                            <img
                                src={book.image}
                                class="h-80 w-full object-cover"
                                alt="Couverture du livre"
                            />

                            <span class="chip variant-glass-primary absolute right-2 top-2">
                                {book.code}
                            </span>

                            <div
                                class="absolute inset-0 z-10 h-80 bg-gradient-to-t from-surface-100 via-transparent via-80% dark:from-surface-800"
                            />
                        </div>

                        <div class="flex flex-col p-4">
                            <small class="opacity-60">{book.isbn}</small>

                            <h1 class="h3">{book.title}</h1>

                            <i>{book.author}</i>
                        </div>

                        <hr />

                        <footer class="card-footer flex items-center justify-between pt-4">
                            <span class="text-lg">
                                ${book.price}
                            </span>

                            <span>{book.state}</span>
                        </footer>
                    </a>
                </li>
            {/each}
        </ul>
    {:else}
        <div class="flex justify-center p-10">
            <span> Aucun livre ne correspond à votre recherche </span>
        </div>
    {/if}
{/await}

{#await data.streamed.count then count}
    <footer class="flex justify-center">
        {#if loadingMore}
            <Loader size="5rem" />
        {:else}
            <button
                on:click={showMore}
                class="btn variant-filled-tertiary"
                disabled={page * 20 > count}
            >
                Afficher plus de résultats
            </button>
        {/if}
    </footer>
{/await}
