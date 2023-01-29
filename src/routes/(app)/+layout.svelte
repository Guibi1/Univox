<script lang="ts">
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";

    const pages = [
        { href: "/menu", title: "Menu" },
        { href: "/livres/achat", title: "Livres" },
        { href: "/horaire", title: "Horaires" },
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

<slot />

<style>
    div a {
        float: left;
        color: #f2f2f2;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 17px;
    }

    div a:hover {
        background-color: #ddd;
        color: black;
    }

    div a[data-active="true"] {
        
        background-color: #04aa6d;
        color: white;
    }
</style>
