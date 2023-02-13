<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { goto } from "$app/navigation";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let loading = false;

    $: if (form?.success) {
        goto("/connexion");
        user.refresh();
    }

    const handleSubmit = (() => {
        loading = true;
        return async ({ update }) => {
            loading = false;
            update();
        };
    }) satisfies SubmitFunction;
</script>

<h1 class="text-center">Mot de passe oublié</h1>

<span hidden={form == null || loading} class="text-center text-red-500">
    {#if form?.missing}
        Veuillez remplir tous les champs
    {:else if !form?.incorrect}
        Vos identifiants Omnivox ne sont pas valide
    {:else if !form?.noUser}
        Aucun utilisateur ne correspond au DA entré
    {/if}
</span>

{#if loading}
    <box-icon name="loader-circle" animation="spin" class="h-10 my-6 flex items-center w-full" />
{/if}

<form
    use:enhance={handleSubmit}
    hidden={loading}
    class="flex flex-col justify-between gap-6"
    method="post"
>
    <label>
        No de DA
        <input value={form?.da ?? ""} name="da" type="text" />
    </label>

    <label>
        Mot de passe Omnivox
        <input name="password" type="password" />
    </label>

    <label>
        Nouveau mot de passe
        <input name="newPassword" type="password" />
    </label>

    <a href="/connexion" class="flex self-start">
        <box-icon name="chevron-left" class="fill-cyan-300" />
        Retour
    </a>

    <button type="submit">Suivant</button>
</form>
