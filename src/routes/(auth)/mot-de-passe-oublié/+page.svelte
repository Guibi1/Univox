<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
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

<h1 class="text-center">Mot de passe oublié</h1>

{#if loading}
    <box-icon name="loader-circle" animation="spin" class="h-10 my-6 flex items-center w-full" />
{/if}

<form use:enhance={handleSubmit} hidden={loading} class="flex flex-col gap-6" method="post">
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

    <button type="submit">Suivant</button>
</form>
