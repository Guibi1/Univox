<script lang="ts">
    import { page } from "$app/stores";
    import Avatar from "$lib/components/Avatar.svelte";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import EmptyDropdown from "$lib/components/EmptyDropdown.svelte";
    import Option from "$lib/components/Option.svelte";
    import friends from "$lib/stores/friends";
    import notifications from "$lib/stores/notifications";
    import LogoText from "$src/assets/logo-text.svelte";

    const pages = [
        { text: "Accueil", href: "/" },
        { text: "Livres", href: "/livres" },
        { text: "Horaire", href: "/horaire" },
        { text: "Amis", href: "/amis" },
    ];

    $: currentPage = pages.reduce(
        (prev, { href }, i) => ($page.url.pathname.startsWith(href) ? i : prev),
        0
    );
</script>

<nav class="flex h-16 items-stretch justify-between bg-blue-secondary">
    <div class="grid aspect-square tablet:hidden">
        <Dropdown actions={[pages]} position="bottom-right">
            <i slot="button" class="bx bx-menu text-2xl" />
        </Dropdown>
    </div>

    <div class="flex justify-center">
        <a href="/" class="flex h-full items-center gap-4 px-4">
            <!-- <Logo size="2.5rem" /> -->
            <LogoText height="2.5rem" />
        </a>
    </div>

    <ul class="relative hidden h-full flex-row items-center justify-between tablet:flex">
        {#each pages as page, i}
            <li class="relative h-full">
                <a
                    href={page.href}
                    class="flex h-full items-center px-4 text-center text-lg text-white transition-[color] duration-300 ease-in-out dark:text-white dark:hover:text-blue-primary"
                >
                    {page.text}

                    {#if currentPage === i}
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2">
                            <hr
                                class="w-16 border-2 !border-blue-primary transition duration-300 ease-in-out"
                            />
                        </span>
                    {/if}
                </a>
            </li>
        {/each}
    </ul>

    <div class="flex flex-row">
        <div class="grid aspect-square">
            <EmptyDropdown position="bottom-left">
                <i
                    slot="button"
                    class={`bx ${
                        $notifications.length === 0 ? "bx-bell" : "bxs-bell-ring"
                    } text-2xl`}
                />

                {#if $notifications.length === 0}
                    <span class="w-fit p-6">Aucune notification</span>
                {:else}
                    {#each $notifications as notification}
                        {#if notification.kind === "FriendRequest"}
                            <div class="flex flex-col gap-4 p-4">
                                <div
                                    class="grid min-w-[15rem] grid-cols-[4rem_1fr] items-center gap-2"
                                >
                                    <Avatar seed={notification.sender.avatar} />

                                    {notification.sender.firstName}
                                    {notification.sender.lastName} veux vous ajouter en ami.
                                </div>

                                <div class="grid h-8 grid-cols-2 gap-2">
                                    <button
                                        class="rounded bg-white transition-[background-color] dark:bg-neutral-600 dark:hover:bg-neutral-500"
                                        on:click={async () => {
                                            await friends.add(notification.sender._id);
                                            await notifications.remove(notification);
                                        }}
                                    >
                                        <i class="bx bx-check text-2xl" />
                                    </button>

                                    <button
                                        class="rounded bg-white transition-[background-color] dark:bg-neutral-600 dark:hover:bg-neutral-500"
                                        on:click={() => notifications.remove(notification)}
                                    >
                                        <i class="bx bx-x text-2xl" />
                                    </button>
                                </div>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </EmptyDropdown>
        </div>

        <div class="grid aspect-square">
            <Dropdown position="bottom-left">
                <div slot="button" class="m-2 rounded-full bg-blue-primary">
                    <Avatar />
                </div>

                <Option text="Mon Profil" href="/profil" />
                <Option text="Paramètres" href="/parametres" />
                <Option text="Se déconnecter" href="/deconnexion" color="red" separate />
            </Dropdown>
        </div>
    </div>
</nav>
