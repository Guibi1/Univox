<script lang="ts">
    import { page } from "$app/stores";
    import logo from "$assets/logo.webp";
    import colorScheme, { colorSchemeIsDark } from "$lib/stores/colorScheme";
    import user from "$lib/stores/user";

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

<div class="h-10">
    <!-- This is a spacer for the top of the page -->
</div>

<nav
    class="absolute inset-0 h-10 flex flex-row justify-between items-center bg-zinc-600 dark:bg-neutral-900"
>
    <div class="h-full flex flex-row items-center gap-2">
        <img class="h-full aspect-square p-1" src={logo} alt="Univox's logo" />
        <h1 class="text-white">UNIVOX</h1>

        <button
            on:click={colorScheme.toggle}
            class="rounded-lg p-1 h-8 aspect-square border-2 border-zinc-400 hover:border-zinc-300 bg-transparent hover:bg-zinc-500 dark:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
        >
            <box-icon name={$colorSchemeIsDark ? "moon" : "sun"} class="w-full h-full" />
        </button>
    </div>

    <ul class="flex flex-row justify-between items-center">
        {#each pages as page, i}
            <li>
                <a
                    href={page.href}
                    class={`flex items-center h-10 px-4 text-white text-center hover:text-black hover:bg-zinc-400 dark:hover:bg-neutral-600 dark:text-white ${
                        i === currentPage && "bg-green-500"
                    }`}
                >
                    {page.title}
                </a>
            </li>
        {/each}
        <li>
            <a
                href="/connexion"
                on:click={user.signout}
                class={`flex items-center h-10 px-4 text-white text-center hover:text-black hover:bg-zinc-400 dark:hover:bg-neutral-600 dark:text-white`}
            >
                Se déconnecter
            </a>
        </li>
    </ul>
</nav>

<slot />
