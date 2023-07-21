<script lang="ts">
    import ConnectionOmnivox from "$lib/components/ConnectionOmnivox.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, message, enhance } = superForm(data.form, {
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

<form use:enhance class="m-auto flex w-80 flex-col gap-6" method="post" action="?/import">
    <ConnectionOmnivox {form} {errors} {submitting} {message} email={$user.email} />

    {#if !$submitting}
        <button type="submit" class="btn variant-filled-secondary">Importer l'horaire</button>
    {:else}
        <div class="flex items-center justify-center">
            <Loader />
        </div>
    {/if}
</form>
