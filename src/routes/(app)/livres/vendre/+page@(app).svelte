<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";
    import { FileDropzone } from "@skeletonlabs/skeleton";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, delayed, enhance } = superForm(data.form, {
        taintedMessage: null,
        onSubmit: ({ data }) => {
            if (!images) return;
            let i = 0;
            for (const image of images) {
                //! TO TEST
                data.append("image" + ++i, image);
            }
        },
    });

    let images: FileList | undefined;
</script>

<svelte:head>
    <title>Univox | Vendre un livre</title>
</svelte:head>

<h1 class="h2 m-6 text-center">Vendre un livre</h1>

<form use:enhance class="m-auto grid max-w-5xl grid-cols-[2fr_2fr] gap-6" method="post">
    <div class="flex flex-col items-stretch gap-5">
        <label class="label" data-error={$errors.title}>
            <span> Nom du livre </span>

            <input name="title" type="text" class="input" value={$form.title} />

            {#if $errors.title}
                <span>{$errors.title[0]}</span>
            {/if}
        </label>

        <label class="label" data-error={$errors.author}>
            <span> Nom de(s) l'auteur(s) </span>

            <input name="author" type="text" class="input" value={$form.author} />

            {#if $errors.author}
                <span>{$errors.author[0]}</span>
            {/if}
        </label>

        <label class="label" data-error={$errors.state}>
            <span> L'état du livre </span>

            <select class="select" name="state" value={$form.state}>
                <option selected disabled hidden value=""> Choisisez une option </option>
                <option> Neuf </option>
                <option> Usagé - Comme neuf </option>
                <option> Usagé - Bon état </option>
                <option> Usagé - Endommagé </option>
            </select>

            {#if $errors.state}
                <span>{$errors.state[0]}</span>
            {/if}
        </label>

        <label class="label" data-error={$errors.isbn}>
            <span> ISBN du livre </span>

            <input name="isbn" type="text" class="input" value={$form.isbn} />

            {#if $errors.isbn}
                <span>{$errors.isbn[0]}</span>
            {/if}
        </label>

        <div class="label" data-error={$errors.classCode}>
            <span> Cours </span>

            <select class="select" name="classCode" value={$form.classCode}>
                <option selected disabled hidden value=""> Choisisez une option </option>

                {#each data.codes as code}
                    <option>{code}</option>
                {/each}
            </select>

            {#if $errors.classCode}
                <span>{$errors.classCode[0]}</span>
            {/if}
        </div>
    </div>

    <div class="flex flex-col items-stretch gap-5">
        <div class="label" data-error={$errors.images}>
            <span> Images </span>

            <FileDropzone bind:files={images} name="files" accept="image/png, image/jpeg">
                <i slot="lead" class="bx bx-cloud-upload pointer-events-none text-7xl" />

                <svelte:fragment slot="message">
                    Glissez ici une image de votre livre
                </svelte:fragment>

                <svelte:fragment slot="meta">Seul les PNG et JPG sont acceptés</svelte:fragment>
            </FileDropzone>

            {#if $errors.images}
                <span>{$errors.images[0]}</span>
            {/if}
        </div>

        <label class="label" data-error={$errors.price}>
            <span> Prix de vente </span>

            <input name="price" type="text" class="input" value={$form.price} />

            {#if $errors.price}
                <span>{$errors.price[0]}</span>
            {/if}
        </label>

        {#if !$delayed}
            <button class="btn variant-filled-secondary" type="submit"> Créer l'annonce </button>
        {:else}
            <div class="flex justify-center">
                <Loader />
            </div>
        {/if}
    </div>
</form>
