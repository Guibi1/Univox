<script lang="ts">
    import { page } from "$app/stores";
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";

    const pages = [
        { href: "/", title: "Accueil" },
        { href: "/livres", title: "Livres" },
        { href: "/horaire", title: "Horaires" },
        { href: "/amis", title: "Amis" },
    ];

    let currentPage = 0;
    $: {
        for (let [i, { href }] of pages.entries()) {
            if ($page.url.pathname.startsWith(href)) currentPage = i;
        }
    }
</script>

<nav
    class="grid h-14 grid-cols-[1fr_min-content_1fr] items-center justify-between bg-blue-secondary"
>
    <div class="flex h-full flex-row items-center gap-2">
        <a href="/">
            <h1
                class="pl-5 text-3xl text-white transition duration-300 ease-in-out hover:text-blue-darkPrimary"
            >
                Univox
            </h1>
        </a>

        <ColorSchemeSwitch />

        <a
            class="flex transition duration-300 ease-in-out hover:fill-blue-primary"
            href="/parametre"
        >
            <box-icon name="cog" class="h-8 w-8 " />
        </a>
    </div>

    <ul class="relative flex h-full flex-row items-center justify-between">
        {#each pages as page, i}
            <li class="relative h-full">
                <a
                    href={page.href}
                    class="flex h-full items-center px-4 text-center text-lg text-white transition-[color] duration-300 ease-in-out dark:text-white dark:hover:text-blue-primary"
                >
                    {page.title}

                    {#if i === currentPage}
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

    <div class="flex h-full justify-end">
        <a
            href="/deconnexion"
            class="flex h-full items-center gap-2 px-4 text-center text-lg text-white transition duration-300 ease-in-out hover:text-red-500"
        >
            Déconnexion
            <box-icon name="log-out" class="h-8 w-8 -scale-x-100 fill-red-500" />
        </a>
    </div>
</nav>
