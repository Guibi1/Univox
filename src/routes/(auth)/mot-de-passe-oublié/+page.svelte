<script context="module" lang="ts">
    import { z } from "zod";

    export const formSchema = z.object({
        email: z.string().email("Courriel invalide"),
        omnivoxPassword: z.string(),
        password: z.string().min(8, "Mot de passe trop court"),
    });
</script>

<script lang="ts">
    import { page } from "$app/stores";
    import Loader from "$lib/components/Loader.svelte";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, enhance } = superForm(data.form);
</script>

<svelte:head>
    <title>Univox | Mot de passe oublié</title>
</svelte:head>

<h1 class="pb-4 text-center">Mot de passe oublié</h1>

<form
    use:enhance
    class="m-auto flex w-9/12 flex-col gap-6"
    method="post"
    action="?/reset"
>
    <div class="flex flex-col gap-4">
        <label data-error={$errors.email}>
            Adresse courriel étudiante
            <input name="email" type="email" value={$form.email} readonly={$submitting} />

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

        <a href={"/connexion" + $page.url.search} class="flex self-start">
            <i class="bx bx-chevron-left text-lg" />
            Retour
        </a>
    </div>

    {#if !$submitting}
        <button type="submit" class="filled flex w-7/12 items-center justify-center self-center">
            Suivant <i class="bx bx-chevron-right" />
        </button>
    {:else}
        <div class="flex items-center justify-center">
            <Loader />
        </div>
    {/if}
</form>
