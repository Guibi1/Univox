<script lang="ts">
    import friends from "$lib/stores/friends";
    import { modalStore, toastStore } from "@skeletonlabs/skeleton";
    import type { User } from "lucia";
    import { api } from "sveltekit-api-fetch";

    let searchQuery = "";
    let results: { users: User[]; otherSchool: boolean }[] = [];

    // Elements
    let elemSearch: HTMLElement;

    function addFriend(user: User) {
        friends.add(user.userId);
        $modalStore[0].response?.(user);
        modalStore.close();
        toastStore.trigger({
            message: `Demande d'ami envoyée à <b>${user.firstName}</b>`,
            background: "variant-filled-success",
            timeout: 3000,
        });
    }

    async function onInput() {
        const res = await api.GET("/api/friends/search", { searchParams: { query: searchQuery } });
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
    class="card w-modal mb-auto mt-8 overflow-hidden bg-surface-100/60 shadow-xl backdrop-blur-lg dark:bg-surface-500/30"
>
    <!-- Header -->
    <header class="bg-surface-300-600-token flex items-center">
        <i class="bx bx-search ml-4 text-2xl" />

        <input
            class="w-full border-0 bg-transparent p-4 text-lg ring-0 focus:ring-0"
            type="search"
            placeholder="Entrez l'adresse courriel de l'élève"
            bind:value={searchQuery}
            on:input={onInput}
            on:keydown={onKeyDown}
        />
    </header>

    <!-- Results -->
    {#if results.length > 0}
        <nav class="hide-scrollbar list-nav max-h-[480px] overflow-x-auto" tabindex="-1">
            {#each results as result}
                {#if result.otherSchool}
                    <div class="p-4 text-sm font-bold">Autres écoles</div>
                {/if}

                <ul>
                    {#each result.users as user}
                        <li class="flex flex-col text-lg">
                            <button
                                class="btn flex justify-between !rounded-none hover:variant-soft focus:!variant-filled-primary"
                                on:click={() => addFriend(user)}
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
            {/each}
        </nav>
    {:else}
        <div class="p-4">
            <p>Aucun utilisateur trouvé.</p>
        </div>
    {/if}

    <!-- Footer -->
    <footer
        class="bg-surface-300-600-token hidden items-center gap-4 p-4 text-xs font-bold md:flex"
    >
        <span><kbd class="kbd">Esc</kbd> pour fermer</span>
        <span><kbd class="kbd">Tab</kbd> pour naviguer</span>
        <span><kbd class="kbd">Enter</kbd> pour ajouter en ami</span>
    </footer>
</modal>
