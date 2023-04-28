<script lang="ts">
    import Option from "$lib/components/Option.svelte";
    import Select from "$lib/components/Select.svelte";
    import firstDayOfTheWeek from "$lib/stores/firstDayOfTheWeek";

    import Avatar from "$lib/components/Avatar.svelte";
    import colorScheme from "$lib/stores/colorScheme";
    import user from "$lib/stores/user";

    const refresh = () => user.setAvatar(Math.random() + $user.firstName + $user.da);
</script>

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
            Étudiant au Collège Bois de Boulogne
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

        <div class="grid grid-cols-2 items-center gap-x-2 gap-y-4">
            <Select bind:value={$firstDayOfTheWeek}>
                <Option text="Lundi" />
                <Option text="Samedi" />
                <Option text="Dimanche" />
            </Select>
            <span class="ml-2 text-2xl">Premier jour de la semaine</span>

            <Select bind:value={$colorScheme}>
                <Option text="Foncé" value="dark" />
                <Option text="Clair" value="light" />
            </Select>
            <span class="ml-2 text-2xl">Thème du site</span>

            <input type="email" name="email" value={$user.email} readonly />
            <span class="ml-2 text-2xl">Adresse courriel</span>
        </div>
    </div>
</div>

<!--Pour donner un sens de sécurité aux utilisateurs-->
<a href="/" class="outlined self-center">Sauvgarder et quitter</a>
