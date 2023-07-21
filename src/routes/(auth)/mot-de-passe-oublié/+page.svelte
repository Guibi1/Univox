<script lang="ts">
    import { page } from "$app/stores";
    import ConnectionOmnivox from "$lib/components/ConnectionOmnivox.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { toastStore } from "@skeletonlabs/skeleton";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, message, enhance } = superForm(data.form, {
        taintedMessage: null,
        onResult: ({ result }) => {
            if (result.type === "redirect") {
                toastStore.trigger({
                    message: "Mot de passe réinitialisé avec succès",
                    background: "variant-filled-primary",
                    timeout: 3000,
                });
            }
        },
    });
</script>

<svelte:head>
    <title>Univox | Mot de passe oublié</title>
</svelte:head>

<h1 class="h2 pb-4 text-center">Mot de passe oublié</h1>

<form use:enhance class="m-auto flex w-9/12 flex-col gap-6" method="post" action="?/reset">
    <div class="flex flex-col gap-4">
        <ConnectionOmnivox {form} {errors} {submitting} {message} />

        <label class="label" data-error={$errors.password}>
            <span> Nouveau mot de passe </span>

            <input
                name="password"
                type="password"
                class="input"
                value={$form.password}
                readonly={$submitting}
            />

            {#if $errors.password}
                <span>{$errors.password[0]}</span>
            {/if}
        </label>

        {#if !$submitting}
            <a href={"/connexion" + $page.url.search} class="flex self-start">
                <i class="bx bx-chevron-left text-lg" />
                Retour
            </a>
        {/if}
    </div>

    {#if !$submitting}
        <button
            type="submit"
            class="btn variant-filled-secondary flex w-7/12 items-center justify-center self-center"
        >
            Suivant <i class="bx bx-chevron-right" />
        </button>
    {:else}
        <div class="flex items-center justify-center">
            <Loader />
        </div>
    {/if}
</form>
