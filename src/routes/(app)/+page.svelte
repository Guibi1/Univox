<script lang="ts">
    import type { Book } from "$lib/Types";
    import Avatar from "$lib/components/Avatar.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import friends from "$lib/stores/friends";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";

    let books: Book[] = [];
</script>

<svelte:head>
    <title>Univox</title>
</svelte:head>

<!--The friend list is in a box with a border that takes the top half of the right part of the screen-->

<!--The schedule takes all of the left part of the screen it is in a grid with two colomns with also the friend list in that-->

<div class="grid grid-cols-2 gap-2">
    <ScheduleView schedule={$schedule} />

    <div class="grid h-full grid-rows-2">
        <!--The friends list is in a box with a border and it is scrollable-->
        <div class="flex h-64 flex-col gap-3 overflow-y-scroll p-3">
            <h2 class="text-center">Amis</h2>
            <!--Loop through the friends-->
            {#each $friends as friend}
                <!--Make the friends have some space in between them-->
                <div class="flex flex-row justify-between">
                    <div class="flex flex-row gap-2">
                        <div class=" h-16 w-16 rounded-full"><Avatar /></div>
                        <div class="flex flex-col">
                            <div>{friend.lastName + ", " + friend.firstName}</div>
                            <div class="text-sm text-gray-500">{friend.email}</div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <button
                            class="h-10 w-24 rounded bg-blue-primary px-4 py-2 font-bold hover:bg-blue-primary"
                            on:click={() => {}}
                        >
                            Horaire
                        </button>
                        <button
                            class="h-10 w-24 rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-800"
                        >
                            Profil
                        </button>
                    </div>
                </div>
            {/each}
        </div>

        <!--The books list is in a box with a border and it is scrollable-->
        <div class="flex h-64 flex-col gap-3 overflow-y-scroll border-t-4 border-gray-600 p-3">
            <h2 class="text-center">Livres</h2>
            <!--Loop through the books-->
            {#each books as book}
                <!--Make the books have some space in between them-->
                <div class="flex flex-row justify-between">
                    <div class="flex flex-row gap-2">
                        <img src={book.src[0]} class="h-20 w-20" />
                        <div class="flex flex-col">
                            <div>{book.title}</div>
                            <div class="text-sm text-gray-500">{book.author}</div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <button
                            class="h-10 w-24 rounded bg-blue-primary px-4 py-2 font-bold hover:bg-blue-primary"
                        >
                            Voir
                        </button>
                        <button
                            class="h-10 w-24 rounded bg-red-600 px-4 py-2 font-bold hover:bg-red-800"
                        >
                            Retirer
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
