<script lang="ts">
    import friends from "$lib/stores/friends";
    import { modalStore, toastStore } from "@skeletonlabs/skeleton";
    import type { User } from "lucia-auth";
    import { api } from "sveltekit-api-fetch";

    let searchQuery = "";
    let results: { users: User[]; otherSchool: boolean }[] = [];

    // Elements
    let elemSearch: HTMLElement;

    function addFriend(user: User) {
        friends.add(user.id);
        $modalStore[0].response?.(user);
        modalStore.close();
        toastStore.trigger({
            message: `Demande d'ami envoyée à <b>${user.firstName}</b>`,
            background: "variant-filled-success",
            timeout: 3000,
        });
    }

    async function onInput() {
        const res = await api.POST("/api/friends/search", { body: { searchQuery } });
        results = await res.json();
    }

    function onKeyDown(event: KeyboardEvent) {
        if (["Enter", "ArrowDown"].includes(event.code)) {
            const queryFirstAnchorElement = elemSearch.querySelector("button");
            if (queryFirstAnchorElement) queryFirstAnchorElement.focus();
        }
    }
</script>

<modal
    bind:this={elemSearch}
    class="card bg-surface-100/60 dark:bg-surface-500/30 backdrop-blur-lg overflow-hidden w-modal shadow-xl mt-8 mb-auto"
>
    <!-- Header -->
    <header class="bg-surface-300-600-token flex items-center">
        <i class="bx bx-search text-2xl ml-4" />

        <input
            class="bg-transparent border-0 ring-0 focus:ring-0 w-full p-4 text-lg"
            type="search"
            placeholder="Entrez l'adresse courriel de l'élève"
            bind:value={searchQuery}
            on:input={onInput}
            on:keydown={onKeyDown}
        />
    </header>

    <!-- Results -->
    {#if results.length > 0}
        <nav class="list-nav overflow-x-auto max-h-[480px] hide-scrollbar" tabindex="-1">
            {#each results as result}
                {#if result.otherSchool}
                    <div class="text-sm font-bold p-4">Autres écoles</div>
                {/if}

                <ul>
                    {#each result.users as user}
                        <li class="text-lg flex flex-col">
                            <button
                                class="!rounded-none btn justify-between flex hover:variant-soft focus:!variant-filled-primary"
                                on:click={() => addFriend(user)}
                            >
                                <div class="flex items-center gap-4">
                                    <i class="bx bx-user-plus text-xl" />

                                    <span class="flex-auto font-bold opacity-75">
                                        {user.firstName}
                                        {user.lastName}
                                    </span>
                                </div>

                                <span class="hidden md:block text-xs opacity-80">{user.email}</span>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/each}
        </nav>
    {:else}
        <div class="p-4">
            <p>Aucun utilisateur trouvé.</p>
        </div>
    {/if}

    <!-- Footer -->
    <footer
        class="hidden md:flex items-center gap-4 bg-surface-300-600-token p-4 text-xs font-bold"
    >
        <span><kbd class="kbd">Esc</kbd> pour fermer</span>
        <span><kbd class="kbd">Tab</kbd> pour naviguer</span>
        <span><kbd class="kbd">Enter</kbd> pour ajouter en ami</span>
    </footer>
</modal>
