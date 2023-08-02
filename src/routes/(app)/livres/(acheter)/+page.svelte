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
    <ul class="flex flex-col divide-y">
        {#each books as book}
            <li>
                <a
                    href={`/livres/${book.id}`}
                    class="grid cursor-pointer grid-cols-[8rem_1fr_5rem] grid-rows-[min-content_min-content_min-content_1fr_min-content] gap-x-6 p-6"
                >
                    <img
                        src={book.image}
                        class="row-span-full h-40 w-32 rounded object-cover"
                        alt="Couverture du livre"
                    />

                    <span class="flex flex-col justify-between">
                        <b>{book.title}</b>
                    </span>

                    <span class="col-start-3 row-span-4 text-right text-lg">
                        {book.price} $
                    </span>

                    <span class="italic">
                        <small>de</small>
                        {book.author}</span
                    >

                    <span class="py-2">{book.state}</span>

                    <span class="py-2">Pour le cours {book.code}</span>

                    <small class="italic">ISBN: {book.isbn}</small>

                    <a href={`/livres/${book.id}`} class="text-right">Détails ></a>
                </a>
            </li>
        {/each}
    </ul>
{/await}
