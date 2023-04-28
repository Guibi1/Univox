<script lang="ts">
    import Option from "$lib/components/Option.svelte";
    import Select from "$lib/components/Select.svelte";
    import firstDayOfTheWeek from "$lib/stores/firstDayOfTheWeek";

    import Avatar from "$lib/components/Avatar.svelte";
    import colorScheme from "$lib/stores/colorScheme";
    import user from "$lib/stores/user";

    const refresh = () => user.setAvatar(Math.random() + $user.firstName + $user.da);

    // Add a temporary email variable
    let tempEmail = $user.email;

    // Update this function to handle email update
    const updateEmail = async () => {
        user.setEmail(tempEmail);
    };
</script>

<div class="mx-auto mb-5 grid gap-6 py-4 laptop:grid-cols-[max-content_40rem] laptop:divide-x">
    <div class="flex flex-col items-center gap-2 space-y-4 text-center">
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

    <div class="space-x-14 space-y-10 laptop:pl-6">
        <h1 class="my-4 flex justify-center gap-4 border-b-2 pb-2">Paramètres</h1>

        <div class="grid grid-cols-2 items-center gap-x-16 gap-y-16">
            <Select bind:value={$firstDayOfTheWeek}>
                <Option text="Lundi" />
                <Option text="Samedi" />
                <Option text="Dimanche" />
            </Select>
            <span class="ml-2 whitespace-nowrap text-2xl">Premier jour de la semaine</span>

            <Select bind:value={$colorScheme}>
                <Option text="Foncé" value="dark" />
                <Option text="Clair" value="light" />
            </Select>
            <span class="ml-2 text-2xl">Thème du site</span>

            <!-- Make the email input field editable and bind its value to tempEmail -->
            <input type="email" name="email" bind:value={tempEmail} />
            <span class="ml-2 text-2xl">Adresse courriel</span>

            <!-- Add the button to change email right under the email field -->
            <button class="outlined col-span-2 gap-2" on:click={updateEmail}>
                Changer l'adresse courriel
            </button>
        </div>
    </div>
</div>

<!--Pour donner un sens de sécurité aux utilisateurs-->
<a href="/" class="outlined justify-bottom flex self-center">Sauvgarder et quitter</a>
