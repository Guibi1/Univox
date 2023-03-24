<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let loading = false;
    let imagesSrc: string[] = [];

    const handleSubmit = (() => {
        loading = true;
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
    <title>Univox | Livres | Nouveau livre</title>
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
    </div>

    <div class="flex flex-col items-stretch gap-5">
        <div class="grid h-[15rem] flex-col rounded-xl">
            {#each imagesSrc as image}
                <img src={image} alt="Livre" />
            {:else}
                <div class="cursor-pointer bg-neutral-500 flex items-center justify-center">
                    <box-icon name="plus" size="3rem" />
                </div>
            {/each}
        </div>

        <button
            class="hover:bg-blue-secondary focus:ring focus:ring-gray-500 active:bg-cyan-900"
            type="submit"
        >
            Créer l'annonce
        </button>
    </div>
</form>
