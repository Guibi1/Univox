<script lang="ts">
    import type { User } from "lucia";
    import { createEventDispatcher } from "svelte";

    export let users: User[];

    const dispatch = createEventDispatcher<{ click: User }>();
    const handleClick = (user: User) => dispatch("click", user);
</script>

<ul>
    {#each users as user}
        <li class="flex flex-col text-lg">
            <button
                class="btn flex justify-between !rounded-none hover:variant-soft focus:!variant-filled-primary"
                on:click={() => handleClick(user)}
            >
                <div class="flex items-center gap-4">
                    <i class="bx bx-user-plus text-xl" />

                    <span class="flex-auto font-bold opacity-75">
                        {user.firstName}
                        {user.lastName}
                    </span>
                </div>

                <span class="hidden text-xs opacity-80 md:block">{user.email}</span>
            </button>
        </li>
    {/each}
</ul>
