<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import Carousel from "$lib/components/Carousel.svelte";
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
        <label data-error={form?.missing}>
            Nom du livre
            <input name="title" type="text" required placeholder=" " />
        </label>

        <label>
            Nom de(s) l'auteur(s)
            <input name="author" type="text" required placeholder=" " />
        </label>

        <label>
            L'état du livre
            <select name="state" required>
                <option>Neuf</option>
                <option>Usagé - Comme neuf</option>
                <option>Usagé - Bon état</option>
                <option>Usagé - Endommagé</option>
            </select>
        </label>

        <label>
            Prix de vente
            <input name="price" type="text" maxlength="3" required placeholder=" " />
        </label>

        <label>
            ISBN
            <input name="isbn" type="text" placeholder=" " required/>
        </label>

        <label>
            Cours
            <input name="classCode" type="text" placeholder=" " required />
        </label>
    </div>

    <div class="flex flex-col items-stretch gap-5">
        <Carousel bind:images />

        <button class="filled" type="submit"> Créer l'annonce </button>
    </div>
</form>
