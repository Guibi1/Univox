<script lang="ts">
    import Carousel from "$lib/components/Carousel.svelte";

    export let data;
</script>

<svelte:head>
    <title>Univox | Livres</title>
</svelte:head>

<div class="flex justify-center gap-6">
    <!-- TODO: Fix the img size -->
    <img class="h-auto max-w-full rounded-lg" src={data.book.image} alt="Couverture du livre" />

    <div class="flex flex-col items-center gap-2 py-4">
        <h1 class="capitalize h2">{data.book.title}</h1>
        <span>
            de <span class="font-bold italic">{data.book.author}</span>
        </span>

        <span>
            Pour le cours
            <span class="underline">{data.book.code}</span>
        </span>

        <span>{data.book.state}</span>

        <span>En vente pour {data.book.price} $</span>

        <span>ISBN : {data.book.isbn}</span>

        <a href="mailto:{data.bookUser?.email}" class="btn variant-filled-secondary"> Contacter </a>
    </div>
</div>
