<script lang="ts">
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";

    const pages = [
        { href: "/accueil", title: "Accueil" },
        { href: "/livres", title: "Livres" },
        { href: "/horaires", title: "Horaires" },
        { href: "/amis", title: "Amis" },
    ];

    let pathname: string = "";
    onDestroy(page.subscribe((page) => (pathname = page.url.pathname)));
</script>

<nav class="bg-gray-700">
    <ul class="flex flex-row h-10">
        {#each pages as page}
            <li
                class={"flex justify-center h-10 hover:bg-cyan-100 p-8" +
                pathname.startsWith(page.href)
                    ? "bg-green-300"
                    : ""}
            >
                <a
                    data-active={pathname.startsWith(page.href)}
                    href={page.href}
                    class="text-white text-center hover:text-black"
                    >{page.title}
                </a>
            </li>
        {/each}
    </ul>
</nav>

<slot />
