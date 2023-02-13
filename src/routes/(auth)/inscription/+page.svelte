<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";

    export let form: ActionData;

    $: if (form?.success) {
        goto("/connexion");
        user.refresh();
    }
</script>

<form class="flex flex-col gap-6" method="post" use:enhance>
    <h1 class="text-center">Inscription</h1>

    <span hidden={form == null} class="text-center text-red-500">
        {#if form?.missing}
            Veuillez remplir tous les champs
        {:else if form?.daExists}
            Un compte avec ce DA existe déjà
        {:else if form?.omnivoxIncorrect}
            Vos identifiants omnivox ne sont pas valides
        {:else if form?.emailIncorrect}
            Assurez-vous d'écrire une adresse courriel valide
        {/if}
    </span>

    <div class="grid grid-cols-2 gap-4">
        <label>
            Prénom
            <input name="firstName" type="text" value={form?.firstName ?? ""} />
        </label>

        <label>
            Nom
            <input name="lastName" type="text" value={form?.lastName ?? ""} />
        </label>

        <label class="col-span-2">
            No de DA
            <input name="da" type="text" value={form?.da ?? ""} />
        </label>

        <label class="col-span-2">
            Mot de passe Omnivox
            <input name="omnivoxPassword" type="password" />
        </label>

        <label class="col-span-2">
            Courriel
            <input name="email" type="email" value={form?.email ?? ""} />
        </label>

        <label class="col-span-2">
            Mot de passe
            <input name="password" type="password" />
        </label>
    </div>

    <div class="flex flex-col">
        <button type="submit">S'inscrire</button>

        <span class="text-center">ou</span>

        <a href="/connexion" class="self-center">Se connecter</a>
    </div>
</form>
