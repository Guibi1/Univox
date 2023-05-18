<script lang="ts">
    import Carousel from "$lib/components/Carousel.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import Option from "$lib/components/Option.svelte";
    import Select from "$lib/components/Select.svelte";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, delayed, enhance } = superForm(data.form, {
        taintedMessage: null,
        onSubmit: ({ data }) => {
            for (const i in images) {
                data.append("image" + i, images[i]);
            }
        },
    });

    let images: File[] = [];
</script>

<svelte:head>
    <title>Univox | Vendre un livre</title>
</svelte:head>

<h1 class="text-center">Vendre un livre</h1>

<form use:enhance class="m-auto grid max-w-5xl grid-cols-[2fr_2fr] gap-6" method="post">
    <div class="flex flex-col items-stretch gap-5">
        <label data-error={$errors.title}>
            Nom du livre

            <input name="title" type="text" value={$form.title} />

            {#if $errors.title}
                <span>{$errors.title[0]}</span>
            {/if}
        </label>

        <label data-error={$errors.author}>
            Nom de(s) l'auteur(s)

            <input name="author" type="text" value={$form.author} />

            {#if $errors.author}
                <span>{$errors.author[0]}</span>
            {/if}
        </label>

        <div class="label" data-error={$errors.state}>
            L'état du livre

            <Select name="state" value={$form.state}>
                <Option text="Neuf" />
                <Option text="Usagé - Comme neuf" />
                <Option text="Usagé - Bon état" />
                <Option text="Usagé - Endommagé" />
            </Select>

            {#if $errors.state}
                <span>{$errors.state[0]}</span>
            {/if}
        </div>

        <label data-error={$errors.price}>
            Prix de vente

            <input name="price" type="text" value={$form.price} />

            {#if $errors.price}
                <span>{$errors.price[0]}</span>
            {/if}
        </label>

        <label data-error={$errors.ISBN}>
            ISBN

            <input name="ISBN" type="text" value={$form.ISBN} />

            {#if $errors.ISBN}
                <span>{$errors.ISBN[0]}</span>
            {/if}
        </label>

        <div class="label" data-error={$errors.classCode}>
            Cours

            <Select name="classCode" value={$form.classCode}>
                {#each data.codes as code}
                    <Option text={code} />
                {/each}
            </Select>

            {#if $errors.classCode}
                <span>{$errors.classCode[0]}</span>
            {/if}
        </div>
    </div>

    <div class="flex flex-col items-stretch gap-5">
        <div class="label" data-error={$errors.images}>
            Images

            <Carousel bind:files={images} />

            {#if $errors.images}
                <span>{$errors.images[0]}</span>
            {/if}
        </div>

        {#if !$delayed}
            <button class="filled" type="submit"> Créer l'annonce </button>
        {:else}
            <div class="flex justify-center">
                <Loader />
            </div>
        {/if}
    </div>
</form>
