<script context="module" lang="ts">
    import { z } from "zod";

    export const formSchema = z.object({
        email: z.string().email("Courriel invalide"),
        omnivoxPassword: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
    });
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import Loader from "$lib/components/Loader.svelte";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, enhance } = superForm(data.form);

    $: firstStep = !$form.firstName;
</script>

<svelte:head>
    <title>Univox | Inscription</title>
</svelte:head>

<h1 class="pb-4 text-center">{firstStep ? "Inscription" : `Bonjour, ${$form.firstName} !`}</h1>

<form
    use:enhance
    class="m-auto flex w-9/12 flex-col gap-6"
    method="post"
    action={firstStep ? "?/firstStep" : "?/secondStep"}
>
    <div
        class="relative grid w-[250%] grid-cols-2 gap-[20%] transition-[right]"
        style="right: {firstStep ? '0' : '150'}%;"
    >
        <div class="flex flex-col gap-4">
            <label data-error={$errors.email}>
                Adresse courriel étudiante
                <input name="email" type="text" value={$form.email} readonly={$submitting} />

                {#if $errors.email}
                    <span>{$errors.email}</span>
                {/if}
            </label>

            <label data-error={$errors.omnivoxPassword}>
                Mot de passe Omnivox
                <input
                    name="omnivoxPassword"
                    type="password"
                    value={$form.omnivoxPassword}
                    readonly={$submitting}
                />

                {#if $errors.omnivoxPassword}
                    <span>{$errors.omnivoxPassword}</span>
                {/if}
            </label>
        </div>

        <div hidden={firstStep} class="flex flex-col gap-4">
            <span>Il manque quelques information pour finaliser votre compte :</span>

            <label data-error={$errors.password}>
                Mot de passe
                <input
                    name="password"
                    type="password"
                    value={$form.password}
                    readonly={$submitting}
                />

                {#if $errors.password}
                    <span>{$errors.password}</span>
                {/if}
            </label>

            <button
                class="flex items-center self-start"
                type="button"
                on:click={() => (firstStep = true)}
            >
                <i class="bx bx-chevron-left text-lg" />
                Retour
            </button>
        </div>
    </div>

    {#if !$submitting}
        <button type="submit" class="filled flex w-7/12 items-center justify-center self-center">
            {firstStep ? "Suivant" : "S'inscrire"} <i class="bx bx-chevron-right text-lg" />
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
        <a href={"/connexion" + $page.url.search} class="outlined m-auto w-7/12"> Se connecter </a>
    </div>
{/if}
