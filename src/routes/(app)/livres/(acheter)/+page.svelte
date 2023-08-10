<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";

    export let data;
</script>

<svelte:head>
    <title>Univox | Livres</title>
</svelte:head>

{#await data.streamed.books}
    <div class="flex justify-center p-10">
        <Loader />
    </div>
{:then books}
    <ul class="flex flex-wrap justify-center gap-4">
        {#each books as book}
            <li>
                <a
                    href={`/livres/${book.id}`}
                    class="card card-hover flex flex-col w-72 overflow-hidden isolate"
                >
                    <div class="grid relative h-44 isolate -z-10">
                        <img
                            src={book.image}
                            class="object-cover h-60 w-full"
                            alt="Couverture du livre"
                        />

                        <span class="chip variant-glass-primary absolute top-2 right-2">
                            {book.code}
                        </span>

                        <div
                            class="bg-gradient-to-t via-80% via-transparent from-surface-100 dark:from-surface-800 z-10 h-60 absolute inset-0"
                        />
                    </div>

                    <div class="flex flex-col p-4">
                        <small class="opacity-60">{book.isbn}</small>

                        <h1 class="h3">{book.title}</h1>

                        <i>{book.author}</i>
                    </div>

                    <hr />

                    <footer class="card-footer pt-4 flex justify-between items-center">
                        <span class="text-lg">
                            ${book.price}
                        </span>

                        <span>{book.state}</span>
                    </footer>
                </a>
            </li>
        {/each}
    </ul>
{/await}
