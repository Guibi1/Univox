<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import Carousel from "$lib/components/Carousel.svelte";
    import Option from "$lib/components/Option.svelte";
    import Select from "$lib/components/Select.svelte";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let loading = false;
    let images: string[] = [];

    const handleSubmit = (({ data }) => {
        loading = true;
        data.append("images", images.join("*-*"));

        return async ({ result, update }) => {
            if (result.type === "redirect") {
                user.refresh();
            }
            loading = false;
            update();
        };
    }) satisfies SubmitFunction;
</script>

<svelte:head>
    <title>Univox | Vendre un livre</title>
</svelte:head>

<h1 class="text-center">Vendre un livre</h1>

<form
    use:enhance={handleSubmit}
    class="m-auto grid max-w-5xl grid-cols-[2fr_2fr] gap-6"
    method="post"
>
    <div class="flex flex-col items-stretch gap-5">
        <label data-error={form?.invalidTitle}>
            Nom du livre
            <input
                name="title"
                type="text"
                required
                value={form?.title ?? ""}
                placeholder=" "
                on:input={() => form && (form.invalidTitle = false)}
            />
            {#if form?.invalidTitle}
                <span>non</span>
            {/if}
        </label>

        <label data-error={form?.invalidAuthor}>
            Nom de(s) l'auteur(s)
            <input
                name="author"
                type="text"
                required
                value={form?.author ?? ""}
                placeholder=" "
                on:input={() => form && (form.invalidAuthor = false)}
            />
            {#if form?.invalidAuthor}
                <span>non</span>
            {/if}
        </label>

        <div class="label" data-error={form?.invalidState}>
            L'état du livre
            <Select name="state" on:change={() => form && (form.invalidState = false)}>
                <Option text="Neuf" />
                <Option text="Usagé - Comme neuf" />
                <Option text="Usagé - Bon état" />
                <Option text="Usagé - Endommagé" />
            </Select>
            {#if form?.invalidState}
                <span>non</span>
            {/if}
        </div>

        <label data-error={form?.invalidPrice}>
            Prix de vente
            <input
                name="price"
                type="text"
                maxlength="3"
                required
                value={form?.price ?? ""}
                placeholder=" "
                on:input={() => form && (form.invalidPrice = false)}
            />
            {#if form?.invalidPrice}
                <span>non</span>
            {/if}
        </label>

        <label data-error={form?.invalidISBN}>
            ISBN
            <input
                name="isbn"
                type="text"
                required
                value={form?.isbn ?? ""}
                placeholder=" "
                on:input={() => form && (form.invalidISBN = false)}
            />
            {#if form?.invalidISBN}
                <span>non</span>
            {/if}
        </label>

        <label data-error={form?.invalidClassCode}>
            Cours
            <input
                name="classCode"
                type="text"
                required
                value={form?.classCode ?? ""}
                placeholder=" "
                on:input={() => form && (form.invalidClassCode = false)}
            />
            {#if form?.invalidClassCode}
                <span>non</span>
            {/if}
        </label>
    </div>

    <div class="flex flex-col items-stretch gap-5">
        <Carousel bind:images />

        <button class="filled" type="submit"> Créer l'annonce </button>
    </div>
</form>
