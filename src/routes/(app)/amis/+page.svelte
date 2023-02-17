<script lang="ts" async>
    import type { User } from "$lib/Types";
    import { onMount } from "svelte";

    let amis: User[] = [];

    onMount(async () => (amis = await (await fetch("/api/user/friends")).json()));
</script>

<h1 class="text-center pt-2 dark:bg-neutral-900">Amis</h1>

<div class="grid grid-cols-[min-content_2fr_1fr] items-start gap-8 p-8" />

{#each amis as ami}
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
