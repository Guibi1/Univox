<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let firstStep = true;
    let loading = false;

    const handleSubmit = (() => {
        loading = true;
        return async ({ result, update }) => {
            loading = false;
            if (result.type === "success") {
                firstStep = false;
            }
            update({ reset: false });
        };
    }) satisfies SubmitFunction;
</script>

<h1 class="text-center pb-4">Inscription</h1>

{#if loading}
    <box-icon name="loader-circle" animation="spin" class="h-10 my-6 flex items-center w-full" />
{/if}

<form use:enhance={handleSubmit} hidden={loading} class="flex flex-col gap-6" method="post">
    <input hidden name="firstStep" value={firstStep} />

    <div hidden={!firstStep} class="grid gap-4">
        <label data-error={form?.daExists}>
            No de DA
            <input
                name="da"
                type="text"
                pattern={"\\d{7}"}
                required={firstStep}
                placeholder=" "
                on:input={() => form && (form.daExists = false)}
                value={form?.da ?? ""}
            />
            {#if form?.daExists}
                <span>Un compte avec ce DA existe déjà</span>
            {/if}
        </label>

        <label data-error={form?.omnivoxIncorrect}>
            Mot de passe Omnivox
            <input
                name="omnivoxPassword"
                type="password"
                required={firstStep}
                placeholder=" "
                on:input={() => form && (form.omnivoxIncorrect = false)}
            />
            {#if form?.omnivoxIncorrect}
                <span>Mot de passe erroné</span>
            {/if}
        </label>
    </div>

    <div hidden={firstStep} class="grid grid-cols-2 gap-4">
        <label>
            Prénom
            <input
                name="firstName"
                type="text"
                pattern={"\\D{2,}"}
                required={!firstStep}
                placeholder=" "
                value={form?.firstName ?? ""}
            />
        </label>

        <label>
            Nom
            <input
                name="lastName"
                type="text"
                pattern={"\\D{2,}"}
                required={!firstStep}
                placeholder=" "
                value={form?.lastName ?? ""}
            />
        </label>

        <label class="col-span-2">
            Courriel
            <input
                name="email"
                type="email"
                pattern={"[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+(\\.[a-zA-Z]+)+"}
                required={!firstStep}
                placeholder=" "
                value={form?.email ?? ""}
            />
        </label>

        <label class="col-span-2">
            Mot de passe
            <input
                name="password"
                type="password"
                pattern={".{8,}"}
                required={!firstStep}
                placeholder=" "
            />
        </label>
    </div>

    <button type="submit">{firstStep ? "Suivant" : "S'inscrire"}</button>

    <span class="text-center">
        ou
        <br />
        <a href="/connexion" class="self-center">Se connecter</a>
    </span>
</form>
