<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
    import Option from "$lib/components/Option.svelte";
    import Select from "$lib/components/Select.svelte";
    import colorScheme from "$lib/stores/colorScheme";
    import user from "$lib/stores/user";
    import { superForm } from "sveltekit-superforms/client";

    export let data;

    const { form, errors, submitting, enhance } = superForm(data.form);

    const refresh = () => user.setAvatar(Math.random() + $user.firstName + $user.da);
</script>

<svelte:head>
    <title>Univox | Paramètres</title>
</svelte:head>

<div class="lg:grid-cols-[max-content_20rem] lg:divide-x mx-auto grid gap-6 py-4">
    <div class="flex flex-col items-center gap-2 text-center">
        <div class="h-32">
            <Avatar />
        </div>

        <button class="outlined gap-2" on:click={refresh}>
            <i class="bx bx-dice-6 text-2xl" />
            Avatar au hasard
        </button>

        <h2 class="h2">
            {$user.firstName}
            {$user.lastName}
        </h2>

        <span class="flex items-center justify-center gap-2">
            <i class="bx bx-map text-2xl" />
            Étudiant au {data.schoolName}
        </span>

        <span>
            Numéro de DA :
            <b>{$user.da}</b>
        </span>

        <a href={"mailto:" + $user.email} class="flex items-center justify-center gap-2">
            <i class="bx bx-envelope text-2xl" />
            {$user.email}
        </a>
    </div>

    <div class="lg:pl-6">
        <h1 class="h1 my-4">Paramètres</h1>

        <form use:enhance method="post" class="flex flex-col gap-x-2 gap-y-4">
            <label class="label">
                <span> Thème du site </span>

                <select bind:value={$colorScheme} class="select">
                    <option value="dark">Foncé</option>
                    <option value="light">Clair</option>
                </select>
            </label>

            <label class="label">
                <span> Nouveau mot de passe </span>

                <input
                    name="password"
                    type="password"
                    class="input"
                    value={$form.password}
                    readonly={$submitting}
                />

                {#if $errors.password}
                    <span>{$errors.password[0]}</span>
                {/if}
            </label>

            <label class="label">
                <span> Confirmer le nouveau mot de passe </span>

                <input
                    name="confirmPassword"
                    type="password"
                    class="input"
                    value={$form.confirmPassword}
                    readonly={$submitting}
                />

                {#if $errors.confirmPassword}
                    <span>{$errors.confirmPassword[0]}</span>
                {/if}
            </label>

            <button class="btn variant-filled-primary my-4">Sauvgarder et quitter</button>
        </form>
    </div>
</div>
