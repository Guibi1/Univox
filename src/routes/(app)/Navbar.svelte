<script lang="ts">
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";

    const pages = [
        { href: "/", title: "Accueil" },
        { href: "/livres", title: "Livres" },
        { href: "/horaires", title: "Horaires" },
        { href: "/amis", title: "Amis" },
    ];

    let pathname: string = "";
    onDestroy(page.subscribe((page) => (pathname = page.url.pathname)));
</script>

<div class="h-10">
    <!-- This is a spacer for the top of the page -->
</div>

<nav class="absolute inset-0 h-10 flex flex-row justify-between items-center bg-zinc-600">
    <div>LOGO</div>

    <ul class="flex flex-row justify-between items-center">
        {#each pages as page}
            <li>
                <a
                    href={page.href}
                    class={"flex items-center h-10 px-4 text-white text-center hover:text-black hover:bg-zinc-400 " +
                        (pathname.startsWith(page.href) ? "bg-green-500" : "")}>{page.title}</a
                >
            </li>
        {/each}
    </ul>
</nav>

<slot />
