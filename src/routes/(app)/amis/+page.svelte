<script lang="ts" async>
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<svelte:head>
    <title>Univox | Amis</title>
</svelte:head>

<h1 class="text-center pt-2 dark:bg-neutral-900">Amis</h1>

<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

{#each data.amis as ami}
    {ami.lastName}
{/each}

<button
    on:click={() => {
        fetch("/api/user/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId: "63eb183ad2cdef1b1f08484c" }),
        });
    }}
>
    add
</button>

<!-- TODO:
faire en sorte que les demandes d'amis soient réciproquent + choisir par le DA + pouvoir enlever des amis -->
