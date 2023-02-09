<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let loading = false;
</script>

<form class="flex flex-col justify-between gap-6" method="post" use:enhance>
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

    <label hidden={loading}>
        No de DA
        <input value={form?.da ?? ""} name="da" type="text" />
    </label>

    <label hidden={loading}>
        Mot de passe Omnivox
        <input name="password" type="password" />
    </label>

    <label hidden={loading}>
        Nouveau mot de passe
        <input name="newPassword" type="password" />
    </label>

    {#if loading}
        <box-icon name="loader-circle" animation="spin" class="self-center" />
    {/if}

    <a href="/connexion" class="flex self-start">
        <box-icon name="chevron-left" class="fill-cyan-300" />
        Retour
    </a>

    <button type="submit">Suivant</button>
</form>
