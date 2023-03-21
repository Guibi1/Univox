<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let firstStep = !true;
    let loading = false;

    const handleSubmit = (({ data }) => {
        if (!firstStep) {
            data.set("da", form?.da ?? "");
            data.set("firstName", form?.firstName ?? "");
            data.set("lastName", form?.lastName ?? "");
            data.set("omnivoxPassword", form?.omnivoxPassword ?? "");
        }
        loading = true;

        return async ({ result, update }) => {
            if (result.type === "success") {
                firstStep = false;
            }
            loading = false;
            update({ reset: true });
        };
    }) satisfies SubmitFunction;
</script>

<svelte:head>
    <title>Univox | Inscription</title>
</svelte:head>

<h1 class="pb-4 text-center">{firstStep ? "Inscription" : `Bonjour, ${form?.firstName} !`}</h1>

<form
    use:enhance={handleSubmit}
    class="m-auto flex w-9/12 flex-col gap-6"
    method="post"
    action={firstStep ? "?/firstStep" : "?/secondStep"}
>
    <div
        class="relative grid w-[250%] grid-cols-2 gap-[20%] transition-[right]"
        style="right: {firstStep ? '0' : '150'}%;"
    >
        <div class="grid gap-4">
            <label data-error={form?.daExists}>
                No de DA
                <input
                    name="da"
                    type="text"
                    pattern={"\\d{7}"}
                    required={firstStep}
                    placeholder=" "
                    on:input={() => form?.daExists && (form.daExists = false)}
                    value={form?.da ?? ""}
                    readonly={loading}
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
                    on:input={() => form?.omnivoxIncorrect && (form.omnivoxIncorrect = false)}
                    readonly={loading}
                />
                {#if form?.omnivoxIncorrect}
                    <span>Mot de passe erroné</span>
                {/if}
            </label>
        </div>

        <div hidden={firstStep} class="grid gap-4">
            <span>Il manque quelques information pour finaliser votre compte :</span>

            <label data-error={form?.emailExists}>
                Courriel
                <input
                    name="email"
                    type="email"
                    pattern="^[a-zA-Z0-9.+]+@([a-zA-Z0-9]+\.)+[a-zA-Z]+$"
                    required={!firstStep}
                    placeholder=" "
                    value={form?.email ?? ""}
                    on:input={() => form?.emailExists && (form.emailExists = false)}
                    readonly={loading}
                />
                {#if form?.emailExists}
                    <span>Un compte avec cette adresse courriel existe déjà</span>
                {/if}
            </label>

            <label>
                Mot de passe
                <input
                    name="password"
                    type="password"
                    pattern={".{8,}"}
                    required={!firstStep}
                    placeholder=" "
                    readonly={loading}
                />
            </label>

            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <a on:click={() => (firstStep = true)} class="self-left flex items-center">
                <box-icon name="chevron-left" /> Retour
            </a>
        </div>
    </div>

    {#if !loading}
        <button type="submit" class="flex w-7/12 items-center justify-center self-center">
            {firstStep ? "Suivant" : "S'inscrire"} <box-icon name="chevron-right" />
        </button>
    {:else}
        <box-icon
            name="loader-circle"
            animation="spin"
            class="my-6 flex h-10 w-full items-center"
        />
    {/if}
</form>

{#if !loading}
    <div class="my-3 flex items-center gap-6">
        <hr class="w-full" />
        <span> ou </span>
        <hr class="w-full" />
    </div>

    <div class="m-auto flex w-9/12">
        <a href={"/connexion" + $page.data.params} class="outlined m-auto w-7/12"> Se connecter </a>
    </div>
{/if}
