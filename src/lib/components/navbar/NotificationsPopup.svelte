<script>
    import Avatar from "$lib/components/Avatar.svelte";
    import friends from "$lib/stores/friends";
    import notifications from "$lib/stores/notifications";
</script>

<div data-popup="notifications" class="card z-[9999] w-72 py-2 shadow-2xl">
    <div class="arrow card" />

    {#if $notifications.length === 0}
        <div class="text-center p-2">Aucune notification</div>
    {:else}
        {#each $notifications as notification}
            {#if notification.kind === "FriendRequest"}
                <div class="flex gap-4 p-2 items-center justify-between">
                    <div class="w-16 h-16 flex-none">
                        <Avatar seed={notification.sender.avatar} />
                    </div>

                    <span>
                        {notification.sender.firstName}
                        {notification.sender.lastName} veux vous ajouter en ami.
                    </span>

                    <div class="flex flex-col justify-center gap-2 pr-2">
                        <button
                            class="btn-icon btn-icon-sm variant-ghost-success"
                            on:click={() => friends.add(notification.sender.userId)}
                        >
                            <i class="bx bx-check text-xl" />
                        </button>

                        <button
                            class="btn-icon btn-icon-sm variant-outline-error"
                            on:click={() => notifications.remove(notification)}
                        >
                            <i class="bx bx-x text-xl" />
                        </button>
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
</div>
