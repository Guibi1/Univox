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

<div class="overflow-hidden bg-gray-700">
    {#each pages as page}
        <a data-active={pathname.startsWith(page.href)} href={page.href}>{page.title}</a>
    {/each}
</div>
    </ul>
</nav>

<slot />
