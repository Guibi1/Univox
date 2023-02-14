<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { goto } from "$app/navigation";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let firstStep = true;
    let loading = false;

    const handleSubmit = (({ data }) => {
        loading = true;
        return async ({ result, update }) => {
            loading = false;
            if (result.type == "success") {
                if (firstStep) {
                    firstStep = false;
                } else {
                    goto("/connexion");
                    user.refresh();
                }
            }
            update({ reset: false });
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
    <input hidden name="firstStep" value={firstStep} />

    <div hidden={!firstStep} class="grid grid-cols-2 gap-4">
        <label class="col-span-2">
            No de DA
            <input
                name="da"
                type="text"
                pattern={"\\d{7}"}
                required={firstStep}
                value={form?.da ?? ""}
                placeholder=" "
            />
            <!-- <span class="text-center text-red-600">Entrez un DA valide</span> -->
        </label>

        <label class="col-span-2">
            Mot de passe Omnivox
            <input name="omnivoxPassword" type="password" required={firstStep} placeholder=" " />
            <span>Bruh</span>
        </label>
    </div>

    <div hidden={firstStep} class="grid grid-cols-2 gap-4">
        <label>
            Prénom
            <input
                name="firstName"
                type="text"
                required={!firstStep}
                value={form?.firstName ?? ""}
            />
        </label>

        <label>
            Nom
            <input name="lastName" type="text" required={!firstStep} value={form?.lastName ?? ""} />
        </label>

        <label class="col-span-2">
            Courriel
            <input name="email" type="email" required={!firstStep} value={form?.email ?? ""} />
        </label>

        <label class="col-span-2">
            Mot de passe
            <input name="password" type="password" pattern={".{8,}"} required={!firstStep} />
        </label>
    </div>

    <button type="submit">{firstStep ? "Suivant" : "S'inscrire"}</button>

    <span class="text-center">
        ou
        <br />
        <a href="/connexion" class="self-center">Se connecter</a>
    </span>
</form>
