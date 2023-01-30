<script lang="ts">
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";

    const pages = [
        { href: "achat", title: "Accueil" },
        { href: "achat", title: "Livres" },
        { href: "achat", title: "Horaires" },
        { href: "achat", title: "Amis" },
    ];

    let pathname: string = "";
    onDestroy(page.subscribe((page) => (pathname = page.url.pathname)));
</script>

<nav class="bg-gray-700">
    <ul class="flex h-14 justify-center gap-x-20 items-center">
        {#each pages as page}
            <li
                class={"flexhover:bg-cyan-100" +
                pathname.startsWith(page.href)
                    ? "bg-green-300"
                    : ""}
            >
                <a
                    data-active={pathname.startsWith(page.href)}
                    href={page.href}
                    class="text-white p-5 text-2xl hover:text-black"
                    >{page.title}
                </a>
            </li>
        {/each}
    </ul>
</nav>

<slot />
