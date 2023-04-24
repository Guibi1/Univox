<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
    import Loader from "$lib/components/Loader.svelte";
    import user from "$lib/stores/user";
    import LogoText from "$src/assets/logo-text.svelte";
    import Logo from "$src/assets/logo.svelte";
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
    <title>Univox | Connexion</title>
</svelte:head>

<h1 class="self-center pb-1">Bienvenue sur</h1>

<div class="flex gap-4 self-center pb-4">
    <LogoText width="9rem" />
    <Logo size="4rem" />
</div>

<form
    use:enhance={handleSubmit}
    class="m-auto flex w-9/12 flex-col gap-6"
    method="post"
    action="?/login"
>
    <div class="flex flex-col gap-4">
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

        <a href={"/mot-de-passe-oublié" + $page.data.params} class="self-end">
            Mot de passe oublié ?
        </a>
    </div>

    {#if !loading}
        <button type="submit" class="filled flex w-7/12 items-center justify-center self-center">
            Se connecter <i class="bx bx-chevron-right text-lg" />
        </button>
    {:else}
        <div class="flex items-center justify-center">
            <Loader />
        </div>
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
