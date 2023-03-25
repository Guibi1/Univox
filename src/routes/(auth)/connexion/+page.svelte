<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";
    import LogoText from "$src/assets/logo-text.svelte";
    import Logo from "$src/assets/logo.svelte";

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
    <title>Univox | Connexion</title>
</svelte:head>

<h1 class="pb-1 self-center">
    Bienvenue sur
</h1>

<div class="flex gap-4 self-center pb-4">
    <LogoText size="9rem" /> <Logo size="4rem" />
</div>

<form
    use:enhance={handleSubmit}
    class="m-auto flex w-9/12 flex-col gap-6"
    method="post"
    action="?/login"
>
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

        <a href={"/mot-de-passe-oublié" + $page.data.params} class="text-right">
            Mot de passe oublié ?
        </a>
    </div>

    {#if !loading}
        <button type="submit" class="flex w-7/12 items-center justify-center self-center">
            Se connecter <box-icon name="chevron-right" />
        </button>
    {:else}
        <box-icon
            name="loader-circle"
            animation="spin"
            class="my-6 flex h-10 w-full items-center"
        />
    {/if}
</form>

{#if !loading}
    <div class="my-3 flex items-center gap-6">
        <hr class="w-full" />
        <span> ou </span>
        <hr class="w-full" />
    </div>

    <div class="m-auto flex w-9/12">
        <a href={"/inscription" + $page.data.params} class="outlined m-auto w-7/12"> S'inscrire </a>
    </div>
{/if}
