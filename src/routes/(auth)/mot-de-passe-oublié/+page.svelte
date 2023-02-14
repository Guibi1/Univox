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

<div class="pb-4 flex items-center justify-center gap-4">
    <img src={logo} class="h-12 aspect-square" alt="Univox's logo" />
    <h1>Mot de passe oublié</h1>
</div>

{#if loading}
    <box-icon name="loader-circle" animation="spin" class="h-10 my-6 flex items-center w-full" />
{/if}

<form
    use:enhance={handleSubmit}
    hidden={loading}
    class="m-auto w-9/12 flex flex-col gap-6"
    method="post"
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
            />
            {#if form?.omnivoxIncorrect}
                <span>Mot de passe Omnivox erroné</span>
            {/if}
        </label>

        <label>
            Nouveau mot de passe
            <input name="newPassword" type="password" pattern={".{8,}"} required placeholder=" " />
        </label>

        <a href="/connexion" class="flex self-start">
            <box-icon name="chevron-left" class="fill-cyan-300" />
            Retour
        </a>
    </div>

    <button type="submit" class="w-7/12 self-center flex items-center justify-center">
        Suivant <box-icon name="chevron-right" />
    </button>
</form>
