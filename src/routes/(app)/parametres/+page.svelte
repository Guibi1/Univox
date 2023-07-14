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

<div class="mx-auto grid gap-6 py-4 laptop:grid-cols-[max-content_40rem] laptop:divide-x">
    <div class="flex flex-col items-center gap-2 text-center">
        <div class="h-32">
            <Avatar />
        </div>

        <button class="outlined gap-2" on:click={refresh}>
            <i class="bx bx-dice-6 text-2xl" />
            Avatar au hasard
        </button>

        <h1>
            {$user.firstName}
            {$user.lastName}
        </h1>

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

    <div class="laptop:pl-6">
        <h1 class="my-4 gap-4 border-b-2 pb-2">Paramètres</h1>

        <form use:enhance method="post" class="grid grid-cols-2 items-center gap-x-2 gap-y-4">
            <Select bind:value={$colorScheme}>
                <Option text="Foncé" value="dark" />
                <Option text="Clair" value="light" />
            </Select>
            <span class="ml-2 text-xl">Thème du site</span>

            <div class="flex flex-col">
                <input
                    name="password"
                    type="password"
                    value={$form.password}
                    readonly={$submitting}
                />

                {#if $errors.password}
                    <span>{$errors.password[0]}</span>
                {/if}
            </div>
            <label for="password" class="ml-2 text-xl">Nouveau mot de passe</label>

            <div class="flex flex-col">
                <input
                    name="confirmPassword"
                    type="password"
                    value={$form.confirmPassword}
                    readonly={$submitting}
                />

                {#if $errors.confirmPassword}
                    <span>{$errors.confirmPassword[0]}</span>
                {/if}
            </div>
            <label for="confirmPassword" class="ml-2 text-xl">
                Confirmer le nouveau mot de passe
            </label>

            <button class="outlined col-span-2 self-center">Sauvgarder et quitter</button>
        </form>
    </div>
</div>
