<script lang="ts">
    export let data;
</script>

<svelte:head>
    <title>Univox | Livres</title>
</svelte:head>

<div class="grid justify-center">
    <section class="flex flex-col w-[32rem]">
        <h1 class="capitalize h2">{data.book.title}</h1>

        <i class="text-xl opacity-70 pb-4">{data.book.author}</i>

        <div class="flex gap-8">
            <!-- TODO: Add a placeholder when no file is uploaded? -->
            <img
                class="h-auto w-52 max-h-80 rounded-lg"
                src={data.book.image}
                alt="Couverture du livre"
            />

            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <span>
                        Pour le cours <code class="code">{data.book.code}</code>
                    </span>

                    <span>{data.book.state}</span>

                    <span>
                        ISBN: <code class="code">{data.book.isbn}</code>
                    </span>
                </div>

                <div class="card flex flex-col gap-4 p-4 text-center">
                    <b class="text-4xl text-secondary-500-400-token">${data.book.price}</b>

                    <span>
                        Vendu par {data.bookUser?.firstName}

                        <span class="flex gap-2 items-center">
                            <i class="bx bx-map text-xl" />
                            {data.school}
                        </span>
                    </span>

                    <a href="mailto:{data.bookUser?.email}" class="btn variant-filled-secondary">
                        Contacter
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>
