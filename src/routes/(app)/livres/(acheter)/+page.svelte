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
{/await}
