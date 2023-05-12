<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import schedule from "$lib/stores/schedule";
    import Loader from "$lib/components/Loader.svelte";
    import type { ActionData } from "../$types";

    export let form: ActionData;
    let loading = false;

    const handleSubmit = (() => {
        loading = true;
        return async ({ result, update }) => {
            if (result.type === "redirect") {
                schedule.refresh();
            }
            loading = false;
            update();
        };
    }) satisfies SubmitFunction;
</script>

<svelte:head>
    <title>Univox | Horaire | Importer</title>
</svelte:head>

<div
    class="flex flex-col items-center gap-4 border-b border-black bg-white p-4 dark:border-neutral-500 dark:bg-neutral-900"
>
    <h1>Importer mon horaire depuis Omnivox</h1>
</div>

{#if loading}
    <div class="flex items-center justify-center">
        <Loader />
    </div>
{/if}

<form
    use:enhance={handleSubmit}
    class="m-auto flex w-80 flex-col gap-6"
    hidden={loading}
    method="post"
    action="/horaire?/import"
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

    <button type="submit" class="filled">Importer l'horaire</button>
</form>
