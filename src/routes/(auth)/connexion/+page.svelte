<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import logo from "$assets/logo.webp";
    import user from "$lib/stores/user";
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
    <title> Univox | Connexion </title>
</svelte:head>

<div class="pb-4 flex items-center justify-center gap-4">
    <img src={logo} class="h-12 aspect-square" alt="Univox's logo" />
    <h1>Bienvenue sur Univox</h1>
</div>

<form use:enhance={handleSubmit} class="m-auto w-9/12 flex flex-col gap-6" method="post">
    <div class="grid grid-rows-2 gap-4">
        <label>
            No de DA
            <input
                name="da"
                type="text"
                pattern={"\\d{7}"}
                required
                placeholder=" "
                value={form?.da ?? ""}
                readonly={loading}
            />
        </label>

        <label data-error={form?.incorrect}>
            Mot de passe
            <input
                name="password"
                type="password"
                pattern={".{8,}"}
                required
                placeholder=" "
                on:input={() => form && (form.incorrect = false)}
                readonly={loading}
            />
            {#if form?.incorrect}
                <span>Mot de passe erroné</span>
            {/if}
        </label>

        <a href="/mot-de-passe-oublié" class="text-right">Mot de passe oublié ?</a>
    </div>

    {#if !loading}
        <button type="submit" class="w-7/12 self-center flex items-center justify-center">
            Se connecter <box-icon name="chevron-right" />
        </button>
    {:else}
        <box-icon
            name="loader-circle"
            animation="spin"
            class="h-10 my-6 flex items-center w-full"
        />
    {/if}
</form>

{#if !loading}
    <div class="my-3 flex items-center gap-6">
        <hr class="w-full" />
        <span> ou </span>
        <hr class="w-full" />
    </div>

    <div class="m-auto w-9/12 flex">
        <a href="/inscription" class="outlined m-auto w-7/12"> S'inscrire </a>
    </div>
{/if}
