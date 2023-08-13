<script lang="ts">
    import type { omnivoxLoginSchema } from "$lib/zod_schemas";
    import type { Readable, Writable } from "svelte/store";
    import type { ValidationErrors } from "sveltekit-superforms";
    import type { z } from "zod";

    export let email: string | undefined = undefined;
    export let form: Readable<z.infer<typeof omnivoxLoginSchema>>;
    export let errors: Writable<ValidationErrors<typeof omnivoxLoginSchema>>;
    export let submitting: Readable<boolean>;
    export let message: Writable<any>;

    $: if (email) $form.email = email;
</script>

<label class="label" data-error={$errors.email}>
    <span> Adresse courriel étudiante </span>

    <input
        name="email"
        type="text"
        class="input"
        bind:value={$form.email}
        readonly={!!email || $submitting}
    />

    {#if $errors.email}
        <span>{$errors.email[0]}</span>
    {/if}
</label>

<label class="label" data-error={$errors.omnivoxPassword}>
    <span> Mot de passe Omnivox </span>

    <input
        name="omnivoxPassword"
        type="password"
        class="input"
        bind:value={$form.omnivoxPassword}
        readonly={$submitting}
    />

    {#if $errors.omnivoxPassword}
        <span>{$errors.omnivoxPassword[0]}</span>
    {/if}
</label>

{#if $form.mfaId}
    <label class="label" data-error={$errors.code}>
        <span>
            Code de sécurité ({$message === "T" ? "application" : "email"})
        </span>

        <input
            name="code"
            type="number"
            min="0"
            max="999999"
            class="input"
            bind:value={$form.code}
            readonly={$submitting}
        />

        {#if $errors.code}
            <span>{$errors.code[0]}</span>
        {/if}
    </label>
{/if}

<input hidden name="session" type="text" bind:value={$form.session} readonly />
<input hidden name="mfaId" type="text" bind:value={$form.mfaId} readonly />
