<script lang="ts">
    import { page } from "$app/stores";
    import logo from "$assets/logo.webp";

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

<nav class="absolute inset-0 h-10 flex flex-row justify-between items-center bg-zinc-600">
    <div class="h-full flex flex-row items-center gap-2">
        <img class="h-full aspect-square p-1" src={logo} alt="Univox's logo" />
        <h1 class="text-white">UNIVOX</h1>
    </div>

    <ul class="flex flex-row justify-between items-center">
        {#each pages as page, i}
            <li>
                <a
                    href={page.href}
                    class={"flex items-center h-10 px-4 text-white text-center hover:text-black hover:bg-zinc-400 " +
                        (i === currentPage ? "bg-green-500" : "")}>{page.title}</a
                >
            </li>
        {/each}
    </ul>
</nav>

<slot />
