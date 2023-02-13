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

<h1 class="text-center">Inscription</h1>

<span hidden={form == null || loading} class="text-center text-red-500">
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

{#if loading}
    <box-icon name="loader-circle" animation="spin" class="h-10 my-6 flex items-center w-full" />
{/if}

<form use:enhance={handleSubmit} hidden={loading} class="flex flex-col gap-6" method="post">
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

    <button type="submit">S'inscrire</button>

    <span class="text-center">
        ou
        <br />
        <a href="/connexion" class="self-center">Se connecter</a>
    </span>
</form>
