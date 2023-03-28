<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
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
    <title>Univox | Mot de passe oublié</title>
</svelte:head>

<h1 class="pb-4 text-center">Mot de passe oublié</h1>

<form
    use:enhance={handleSubmit}
    class="m-auto flex w-9/12 flex-col gap-6"
    method="post"
    action="?/reset"
>
    <div class="flex flex-col gap-4">
        <label data-error={form?.incorrect}>
            No de DA
            <input
                name="da"
                type="text"
                pattern={"\\d{7}"}
                required
                placeholder=" "
                on:input={() => form && (form.incorrect = false)}
                value={form?.da ?? ""}
                readonly={loading}
            />
            {#if form?.incorrect}
                <span>Aucun utilisateur ne correspond au DA entré</span>
            {/if}
        </label>

        <label data-error={form?.omnivoxIncorrect}>
            Mot de passe Omnivox
            <input
                name="omnivoxPassword"
                type="password"
                required
                placeholder=" "
                on:input={() => form && (form.omnivoxIncorrect = false)}
                readonly={loading}
            />
            {#if form?.omnivoxIncorrect}
                <span>Mot de passe Omnivox erroné</span>
            {/if}
        </label>

        <label>
            Nouveau mot de passe
            <input
                name="newPassword"
                type="password"
                pattern={".{8,}"}
                required
                placeholder=" "
                readonly={loading}
            />
        </label>

        <a href={"/connexion" + $page.data.params} class="flex self-start">
            <i class="bx bx-chevron-left text-lg" />
            Retour
        </a>
    </div>

    {#if !loading}
        <button type="submit" class="filled flex w-7/12 items-center justify-center self-center">
            Suivant <i class="bx bx-chevron-right" />
        </button>
    {:else}
        <div class="flex items-center justify-center">
            <i class="bx bx-loader-circle bx-spin my-2 text-5xl" />
        </div>
    {/if}
</form>
