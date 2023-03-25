<script lang="ts">
    import { page } from "$app/stores";
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";

    const pages = [
        { href: "/", title: "Accueil" },
        { href: "/livres", title: "Livres" },
        { href: "/horaire", title: "Horaires" },
        { href: "/amis", title: "Amis" },
    ];

    let currentPage: number = 0;
    $: {
        for (let [i, { href }] of pages.entries()) {
            if ($page.url.pathname.startsWith(href)) currentPage = i;
        }
    }
</script>

<div class="h-14">
    <!-- This is a spacer for the top of the page -->
</div>

<nav
    class="fixed z-50 inset-0 grid h-14 grid-cols-[1fr_min-content_1fr] items-center justify-between bg-zinc-600 dark:bg-blue-secondary"
>
    <div class="flex h-full flex-row items-center gap-2">
        <a href="/">
            <h1 class="pl-5 text-3xl text-white hover:text-blue-darkPrimary transition ease-in-out duration-300">Univox</h1>
        </a>

        <ColorSchemeSwitch />

        <a class="flex hover:fill-blue-primary transition ease-in-out duration-300" href="/parametre">
            <box-icon name="cog" class="h-8 w-8 " />
        </a>
    </div>

    <ul class="flex h-full flex-row items-center justify-between">
        {#each pages as page, i}
            <li class="relative h-full">
                <a
                    href={page.href}
                    class={`transition ease-in-out duration-300  flex h-full items-center px-4 text-center text-lg text-white dark:hover:text-blue-primary dark:text-white ${
                        i === currentPage ? "" : ""
                    }`}
                >
                    {page.title}
                    {#if i === currentPage}
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
                            <hr class="border-2 w-16 !border-blue-primary transition ease-in-out duration-300" />
                        </span>
                    {/if}
                </a>
            </li>
        {/each}
    </ul>

    <div class="flex h-full justify-end">
        <a
            href="/deconnexion"
            class="flex h-full items-center gap-2 px-4 text-center text-lg transition ease-in-out duration-300 hover:text-red-500"
        >
            Déconnexion
            <box-icon name="log-out" class="h-8 w-8 -scale-x-100 fill-red-500" />
        </a>
    </div>
</nav>
