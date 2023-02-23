<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import logo from "$assets/logo.webp";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let firstStep = true;
    let loading = false;

    const handleSubmit = (() => {
        loading = true;
        return async ({ result, update }) => {
            if (result.type === "success") {
                firstStep = false;
            }
            loading = false;
            update({ reset: false });
        };
    }) satisfies SubmitFunction;
</script>

<div class="pb-4 flex items-center justify-center gap-4">
    <img src={logo} class="h-12 aspect-square" alt="Univox's logo" />
    <h1>Inscription</h1>
</div>

<form use:enhance={handleSubmit} class="m-auto w-9/12 flex flex-col gap-6" method="post">
    <input hidden name="firstStep" value={firstStep} />

    <div
        class="relative w-[240%] grid grid-cols-2 gap-[20%] transition-[right]"
        style="right: {firstStep ? '0' : '140'}%;"
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
                    on:input={() => form && (form.daExists = false)}
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
                    on:input={() => form && (form.omnivoxIncorrect = false)}
                    readonly={loading}
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
                    readonly={loading}
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
                    readonly={loading}
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
                    readonly={loading}
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
                    readonly={loading}
                />
            </label>

            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
                on:click={() => (firstStep = true)}
                class="col-span-2 self-left flex items-center"
                href="javascript:void()"
            >
                <box-icon name="chevron-left" class="fill-cyan-300" /> Retour
            </a>
        </div>
    </div>

    {#if !loading}
        <button type="submit" class="w-7/12 self-center flex items-center justify-center">
            {firstStep ? "Suivant" : "S'inscrire"} <box-icon name="chevron-right" />
        </button>
    {:else}
        <box-icon
            name="loader-circle"
            animation="spin"
            class="h-10 my-6 flex items-center w-full"
        />
    {/if}
</form>

{#if !loading}
    <div class="my-3 flex items-center gap-6">
        <hr class="w-full" />
        <span> ou </span>
        <hr class="w-full" />
    </div>

    <div class="m-auto w-9/12 flex">
        <a href="/connexion" class="outlined m-auto w-7/12"> Se connecter </a>
    </div>
{/if}
