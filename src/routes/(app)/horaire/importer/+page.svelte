<script lang="ts">
    import user from "$lib/stores/user";
    import { enhance, type SubmitFunction } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let loading = false;

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
    <title> Univox | Horaire | Importer </title>
</svelte:head>

<div class="m-auto w-fit pb-4 flex flex-col items-center justify-center gap-4">
    <h1>Importer mon horaire de session depuis Omnivox</h1>

    {#if loading}
        <box-icon
            name="loader-circle"
            animation="spin"
            class="h-10 my-6 flex items-center w-full"
        />
    {/if}
</div>

<form
    use:enhance={handleSubmit}
    hidden={loading}
    class="m-auto w-80 flex flex-col gap-6"
    method="post"
>
    <label data-error={form?.incorrect}>
        Mot de passe Omnivox
        <input
            name="omnivoxPassword"
            type="password"
            required
            placeholder=" "
            on:input={() => form && (form.incorrect = false)}
        />
        {#if form?.incorrect}
            <span>Mot de passe erroné</span>
        {/if}
    </label>

    <button type="submit">Importer l'horaire</button>
</form>
