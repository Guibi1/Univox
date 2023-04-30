<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";
    import schedule from "$lib/stores/schedule.js";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, delayed, enhance } = superForm(data.form, {
        taintedMessage: null,
        onResult: ({ result }) => {
            if (result.type === "redirect") {
                schedule.refresh();
            }
        },
    });
</script>

<svelte:head>
    <title>Univox | Horaire | Importer</title>
</svelte:head>

<div
    class="flex flex-col items-center gap-4 border-b border-black bg-white p-4 dark:border-neutral-500 dark:bg-neutral-900"
>
    <h1>Importer mon horaire depuis Omnivox</h1>
</div>

{#if $delayed}
    <div class="flex items-center justify-center">
        <Loader />
    </div>
{/if}

<form
    use:enhance
    class="m-auto flex w-80 flex-col gap-6"
    hidden={$delayed}
    method="post"
    action="/horaire?/import"
>
    <label data-error={$errors.omnivoxPassword}>
        Mot de passe Omnivox
        <input
            name="omnivoxPassword"
            type="password"
            value={$form.omnivoxPassword}
            readonly={$delayed}
        />

        {#if $errors.omnivoxPassword}
            <span>{$errors.omnivoxPassword[0]}</span>
        {/if}
    </label>

    <button type="submit" class="filled">Importer l'horaire</button>
</form>
