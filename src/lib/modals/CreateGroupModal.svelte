<script lang="ts">
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
    import type { User } from "lucia";
    import UsersList from "./components/UsersList.svelte";

    const modalStore = getModalStore();
    const toastStore = getToastStore();

    let searchQuery = "";
    let name = "";
    let results: { users: User[]; otherSchool: boolean }[] = [];
    let selectedUsers: Set<User> = new Set();

    function selectUser(user: User) {
        selectedUsers.add(user);
        searchQuery = "";
        results = [];
        selectedUsers = selectedUsers;
    }

    function unselectUser(user: User) {
        selectedUsers.delete(user);
        selectedUsers = selectedUsers;
    }

    function createGroup() {
        const users = [...selectedUsers];
        groups.create(name, users);
        $modalStore[0].response?.({ name, users });
        modalStore.close();
        toastStore.trigger({
            message: `Groupe créé avec succès`,
            background: "variant-filled-success",
            timeout: 3000,
        });
    }
</script>

<modal
    class="card w-modal mb-auto mt-8 overflow-hidden bg-surface-100/60 shadow-xl backdrop-blur-lg dark:bg-surface-500/30"
>
    <!-- Header -->
    <header class="bg-surface-300-600-token flex items-center">
        <i class="bx bx-group ml-4 text-2xl" />

        <input
            class="w-full border-0 bg-transparent p-4 text-lg ring-0 focus:ring-0"
            type="search"
            placeholder="Nom du groupe"
            bind:value={name}
        />

        <button
            class="variant-filled-tertiary btn mx-4"
            on:click={createGroup}
            disabled={selectedUsers.size < 2 || name.length < 3}
        >
            Créer le groupe
        </button>
    </header>

    <!-- Selected users -->
    <div class="flex flex-wrap justify-center gap-2">
        {#each selectedUsers as user}
            <span
                class="variant-ghost-tertiary chip m-2"
                on:click={() => unselectUser(user)}
                on:keypress
                role="button"
                tabindex="-1"
            >
                <span> {user.email} </span>
                <span> ✕ </span>
            </span>
        {/each}
    </div>

    <!-- Results -->
    {#if results.length > 0}
        <nav class="list-nav hide-scrollbar max-h-[480px] overflow-x-auto" tabindex="-1">
            {#each results as result}
                {#if result.otherSchool}
                    <div class="p-4 text-sm font-bold">Autres écoles</div>
                {/if}

                <UsersList users={result.users} on:click={(e) => selectUser(e.detail)} />
            {/each}
        </nav>
    {:else}
        <nav class="list-nav hide-scrollbar max-h-[480px] overflow-x-auto" tabindex="-1">
            <UsersList users={$friends} on:click={(e) => selectUser(e.detail)} />
        </nav>
    {/if}

    <!-- Footer -->
    <footer
        class="bg-surface-300-600-token hidden items-center gap-4 p-4 text-xs font-bold md:flex"
    >
        <span><kbd class="kbd">Esc</kbd> pour fermer</span>
        <span><kbd class="kbd">Tab</kbd> pour naviguer</span>
        <span><kbd class="kbd">Enter</kbd> pour ajouter au groupe</span>
    </footer>
</modal>
