<script lang="ts">
    import firstDayOfTheWeek from "$lib/stores/firstDayOfTheWeek";
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";
    import Select from "$lib/components/Select.svelte";
    import Option from "$lib/components/Option.svelte";

    import Avatar from "$lib/components/Avatar.svelte";
    import user from "$lib/stores/user";

    const refresh = () => user.setAvatar(Math.random() + $user.firstName + $user.da);
</script>

<div class="grid grid-cols-[1fr_2fr]">
    <div class="m-auto flex w-fit gap-4">
        <div class="flex flex-col">
            <Avatar />

            <button class="filled gap-2" on:click={refresh}>
                <i class="bx bx-dice-6 text-2xl" />
                Avatar au hasard
            </button>
        </div>

        <div class="flex flex-col items-start gap-1 pt-6">
            <h1>
                {$user.firstName}
                {$user.lastName}
            </h1>

            <span class="flex items-center gap-1">
                <i class="bx bx-map text-2xl" />
                Étudiant au Collège Bois de Boulogne
            </span>

            <span>
                Numéro de DA :
                <b>{$user.da}</b>
            </span>

            <a href={"mailto:" + $user.email} class="flex items-center gap-1">
                <i class="bx bx-envelope text-2xl" />
                {$user.email}
            </a>
        </div>
    </div>

    <h1 class="text-center">Paramètres</h1>
</div>

<h1 class="text-center">Paramètres</h1>

<ColorSchemeSwitch />

<!--Pour donner un sens de sécurité aux utilisateurs-->
<a href="/">Sauvgarder et quitter</a>

<svelte:head>
    <title>Univox | Mon Profil</title>
</svelte:head>

<main class="m-auto flex w-fit gap-4">
    <div class="flex flex-col">
        <Avatar />

        <button class="filled gap-2" on:click={refresh}>
            <i class="bx bx-dice-6 text-2xl" />
            Avatar au hasard
        </button>
    </div>

    <div class="flex flex-col items-start gap-1 pt-6">
        <h1>
            {$user.firstName}
            {$user.lastName}
        </h1>

        <span class="flex items-center gap-1">
            <i class="bx bx-map text-2xl" />
            Étudiant au Collège Bois de Boulogne
        </span>

        <span>
            Numéro de DA :
            <b>{$user.da}</b>
        </span>

        <a href={"mailto:" + $user.email} class="flex items-center gap-1">
            <i class="bx bx-envelope text-2xl" />
            {$user.email}
        </a>
    </div>
</main>
