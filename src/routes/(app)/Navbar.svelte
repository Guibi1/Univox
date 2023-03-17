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
    class="absolute inset-0 h-14 grid grid-cols-[1fr_min-content_1fr] justify-between items-center bg-zinc-600 dark:bg-neutral-800"
>
    <div class="h-full flex flex-row items-center gap-2">
        <h1 class="text-white pl-5 text-3xl">Univox</h1>

        <ColorSchemeSwitch />

        <a class="flex" href="/parametre">
            <box-icon name="cog" class="h-8 w-8 " />
        </a>
    </div>

    <ul class="h-full flex flex-row justify-between items-center">
        {#each pages as page, i}
            <li class="h-full relative">
                <a
                    href={page.href}
                    class={`flex items-center h-full px-4 text-lg text-white text-center hover:text-black hover:bg-zinc-400 dark:hover:bg-neutral-600 dark:text-white ${
                        i === currentPage ? "" : ""
                    }`}
                >
                    {page.title}
                    {#if i === currentPage}
                        <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2">
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

    <div class="h-full flex justify-end">
        <a
            href="/deconnexion"
            class="flex gap-2 items-center h-full px-4 text-lg text-orange-primary text-center hover:text-black hover:bg-zinc-400 dark:hover:bg-neutral-600 dark:text-white"
        >
            Déconnexion
            <box-icon name="log-out" class="h-8 w-8 fill-orange-primary -scale-x-100" />
        </a>
    </div>
</nav>
