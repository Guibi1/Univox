<script>
    import Avatar from "$lib/components/Avatar.svelte";
    import friends from "$lib/stores/friends";
    import notifications from "$lib/stores/notifications";
</script>

<div data-popup="notifications" class="card z-[9999] w-48 py-2 shadow-xl">
    <div class="arrow card bg-surface-100-800-token" />

    {#if $notifications.length === 0}
        <span class="w-fit p-6">Aucune notification</span>
    {:else}
        {#each $notifications as notification}
            {#if notification.kind === "FriendRequest"}
                <div class="flex flex-col gap-4 p-4">
                    <div class="grid min-w-[15rem] grid-cols-[4rem_1fr] items-center gap-2">
                        <Avatar seed={notification.sender.avatar} />

                        {notification.sender.firstName}
                        {notification.sender.lastName} veux vous ajouter en ami.
                    </div>

                    <div class="grid h-8 grid-cols-2 gap-2">
                        <button
                            class="rounded bg-white transition-[background-color] dark:bg-neutral-600 dark:hover:bg-neutral-500"
                            on:click={() => friends.add(notification.sender.id)}
                        >
                            <i class="bx bx-check text-2xl" />
                        </button>

                        <button
                            class="rounded bg-white transition-[background-color] dark:bg-neutral-600 dark:hover:bg-neutral-500"
                            on:click={() => notifications.remove(notification)}
                        >
                            <i class="bx bx-x text-2xl" />
                        </button>
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
</div>
