<script lang="ts">
    import { page } from "$app/stores";
    import ConnectionOmnivox from "$lib/components/ConnectionOmnivox.svelte";
    import Loader from "$lib/components/Loader.svelte";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, message, enhance } = superForm(data.form, {
        taintedMessage: null,
    });
</script>

<svelte:head>
    <title>Univox | Inscription</title>
</svelte:head>

<h1 class="h2 pb-4 text-center">
    {$form.firstStep ? "Inscription" : `Bonjour, ${$form.firstName} !`}
</h1>

<form use:enhance class="m-auto flex w-9/12 flex-col gap-6" method="post" action="?/signup">
    <div
        class="relative grid w-[250%] grid-cols-2 gap-[20%] transition-[right]"
        style="right: {$form.firstStep ? '0' : '150'}%;"
    >
        <div class="flex flex-col gap-4">
            <ConnectionOmnivox {form} {errors} {submitting} {message} />
        </div>

        <div hidden={$form.firstStep} class="flex flex-col gap-4">
            <span>Il manque quelques information pour finaliser votre compte :</span>

            <label class="label" data-error={$errors.password}>
                <span> Mot de passe </span>

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

            <label class="label" data-error={$errors.confirmPassword}>
                <span> Confirmer le mot de passe </span>

                <input
                    name="confirmPassword"
                    type="password"
                    class="input"
                    value={$form.confirmPassword}
                    readonly={$submitting}
                />

                {#if $errors.confirmPassword}
                    <span>{$errors.confirmPassword[0]}</span>
                {/if}
            </label>

            <button
                class="flex items-center self-start"
                type="button"
                on:click={() => ($form.firstStep = true)}
            >
                <i class="bx bx-chevron-left text-lg" />
                Retour
            </button>
        </div>
    </div>

    <input
        hidden
        class="hidden"
        name="firstStep"
        type="checkbox"
        bind:checked={$form.firstStep}
        readonly
    />
    <input hidden name="firstName" type="text" bind:value={$form.firstName} readonly />
    <input hidden name="lastName" type="text" bind:value={$form.lastName} readonly />

    {#if !$submitting}
        <button
            type="submit"
            class="btn variant-filled-secondary flex w-7/12 items-center justify-center self-center"
        >
            {$form.firstStep ? "Suivant" : "S'inscrire"} <i class="bx bx-chevron-right text-lg" />
        </button>
    {:else}
        <div class="flex items-center justify-center">
            <Loader />
        </div>
    {/if}
</form>

{#if !$submitting}
    <div class="my-3 flex items-center gap-6">
        <hr class="w-full" />
        <span> ou </span>
        <hr class="w-full" />
    </div>

    <div class="m-auto flex w-9/12">
        <a
            href={"/connexion" + $page.url.search}
            class="btn variant-outline-secondary m-auto w-7/12"
        >
            Se connecter
        </a>
    </div>
{/if}
