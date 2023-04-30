<script lang="ts">
    import { page } from "$app/stores";
    import Loader from "$lib/components/Loader.svelte";
    import LogoText from "$src/assets/logo-text.svelte";
    import Logo from "$src/assets/logo.svelte";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, enhance } = superForm(data.form, { taintedMessage: null });
</script>

<svelte:head>
    <title>Univox | Connexion</title>
</svelte:head>

<h1 class="self-center pb-1">Bienvenue sur</h1>

<div class="flex gap-4 self-center pb-4">
    <LogoText width="9rem" />
    <Logo size="4rem" />
</div>

<form use:enhance class="m-auto flex w-9/12 flex-col gap-6" method="post" action="?/login">
    <div class="flex flex-col gap-4">
        <label data-error={$errors.email}>
            Adresse courriel étudiante
            <input name="email" type="email" value={$form.email} readonly={$submitting} />

            {#if $errors.email}
                <span>{$errors.email[0]}</span>
            {/if}
        </label>

        <label data-error={$errors.password}>
            Mot de passe
            <input name="password" type="password" value={$form.password} readonly={$submitting} />

            {#if $errors.password}
                <span>{$errors.password[0]}</span>
            {/if}
        </label>

        <a href={"/mot-de-passe-oublié" + $page.url.search} class="self-end">
            Mot de passe oublié ?
        </a>
    </div>

    {#if !$submitting}
        <button type="submit" class="filled flex w-7/12 items-center justify-center self-center">
            Se connecter <i class="bx bx-chevron-right text-lg" />
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
        <a href={"/inscription" + $page.url.search} class="outlined m-auto w-7/12"> S'inscrire </a>
    </div>
{/if}
