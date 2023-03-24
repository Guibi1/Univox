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
    class="absolute inset-0 grid h-14 grid-cols-[1fr_min-content_1fr] items-center justify-between bg-zinc-600 dark:bg-neutral-800"
>
    <div class="flex h-full flex-row items-center gap-2">
        <h1 class="pl-5 text-3xl text-white">Univox</h1>

        <ColorSchemeSwitch />

        <a class="flex" href="/parametre">
            <box-icon name="cog" class="h-8 w-8 " />
        </a>
    </div>

    <ul class="flex h-full flex-row items-center justify-between">
        {#each pages as page, i}
            <li class="relative h-full">
                <a
                    href={page.href}
                    class={`flex h-full items-center px-4 text-center text-lg text-white hover:bg-zinc-400 hover:text-black dark:text-white dark:hover:bg-neutral-600 ${
                        i === currentPage ? "" : ""
                    }`}
                >
                    {page.title}
                    {#if i === currentPage}
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
                            <svg viewBox="0 0 10 10" class="h-4">
                                <polygon
                                    points="0,8 5,4 10,8"
                                    class="fill-current text-blue-primary"
                                />
                            </svg>
                        </span>
                    {/if}
                </a>
            </li>
        {/each}
    </ul>

    <div class="flex h-full justify-end">
        <a
            href="/deconnexion"
            class="flex h-full items-center gap-2 px-4 text-center text-lg text-orange-primary hover:bg-zinc-400 hover:text-black dark:text-white dark:hover:bg-neutral-600"
        >
            Déconnexion
            <box-icon name="log-out" class="h-8 w-8 -scale-x-100 fill-orange-primary" />
        </a>
    </div>
</nav>
