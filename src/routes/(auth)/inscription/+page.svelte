<script lang="ts">
    import { page } from "$app/stores";
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
            <label class="label" data-error={$errors.email}>
                <span> Adresse courriel étudiante </span>

                <input
                    name="email"
                    type="text"
                    class="input"
                    value={$form.email}
                    readonly={$submitting}
                />

                {#if $errors.email}
                    <span>{$errors.email[0]}</span>
                {/if}
            </label>

            <label class="label" data-error={$errors.omnivoxPassword}>
                <span> Mot de passe Omnivox </span>

                <input
                    name="omnivoxPassword"
                    type="password"
                    class="input"
                    value={$form.omnivoxPassword}
                    readonly={$submitting}
                />

                {#if $errors.omnivoxPassword}
                    <span>{$errors.omnivoxPassword[0]}</span>
                {/if}
            </label>

            {#if $form.mfaId}
                <label class="label" data-error={$errors.code}>
                    <span>
                        Code de sécurité ({$message === "T" ? "application" : "email"})
                    </span>

                    <input
                        name="code"
                        type="number"
                        min="0"
                        max="999999"
                        class="input"
                        value={$form.code}
                        readonly={$submitting}
                    />

                    {#if $errors.code}
                        <span>{$errors.code[0]}</span>
                    {/if}
                </label>
            {/if}
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
    <input hidden name="session" type="text" bind:value={$form.session} readonly />
    <input hidden name="mfaId" type="text" bind:value={$form.mfaId} readonly />
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
