<script lang="ts">
    import { page } from "$app/stores";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Option from "$lib/components/Option.svelte";
    import LogoText from "$src/assets/logo-text.svelte";

    const pages = [
        { text: "Accueil", href: "/" },
        { text: "Livres", href: "/livres" },
        { text: "Horaires", href: "/horaire" },
        { text: "Amis", href: "/amis" },
    ];

    $: currentPage = pages.reduce(
        (prev, { href }, i) => ($page.url.pathname.startsWith(href) ? i : prev),
        0
    );
</script>

<nav class="flex h-14 items-stretch justify-between bg-blue-secondary">
    <div class="grid aspect-square tablet:hidden">
        <Dropdown actions={[pages]} position="bottom-right">
            <i slot="button" class="bx bx-menu" />
        </Dropdown>
    </div>

    <div class="flex justify-center">
        <a href="/" class="flex h-full items-center gap-4 px-4">
            <!-- <Logo size="2.5rem" /> -->
            <LogoText height="2rem" />
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
            <Dropdown position="bottom-left">
                <i slot="button" class="bx bx-bell text-2xl" />
            </Dropdown>
        </div>

        <div class="grid aspect-square">
            <Dropdown position="bottom-left">
                <i slot="button" class="bx bx-user text-2xl" />

                <Option text="Mon Profil" href="/profil" />
                <Option text="Paramètres" href="/parametres" />
                <Option text="Se déconnecter" href="/deconnexion" color="red" separate />
            </Dropdown>
        </div>
    </div>
</nav>
