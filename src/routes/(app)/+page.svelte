<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import friends from "$lib/stores/friends";
    import schedule from "$lib/stores/schedule";

    export let data;
</script>

<svelte:head>
    <title>Univox</title>
</svelte:head>

<!--The friend list is in a box with a border that takes the top half of the right part of the screen-->

<!--The schedule takes all of the left part of the screen it is in a grid with two colomns with also the friend list in that-->

<div class="grid h-screen grid-cols-2 gap-2 overflow-y-hidden">
    <ScheduleView schedule={$schedule} periodsCanBeDeleted />

    <div class="grid h-full grid-rows-2 divide-y overflow-y-hidden border-gray-600">
        <!--The friends list is in a box with a border and it is scrollable-->
        <div class="flex h-full flex-col gap-3 pt-2">
            <h2 class="text-center">Amis</h2>

            <div class="overflow-y-auto">
                <!--Loop through the friends-->
                <!-- {#each $friends as i} -->
                {#each $friends as friend}
                    <!--Make the friends have some space in between them-->
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-2 px-3">
                            <div class=" h-16 w-16 rounded-full">
                                <Avatar seed={friend.avatar} />
                            </div>
                            <div class="flex flex-col">
                                <div>{friend.lastName + ", " + friend.firstName}</div>
                                <div class="text-sm text-gray-500">{friend.email}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-3 px-5">
                            <a class="filled h-10 w-24" href="/amis?friendId={friend._id}">
                                Horaire
                            </a>
                        </div>
                    </div>
                    <!-- {/each} -->
                {/each}
            </div>
        </div>

        <!--The books list is in a box with a border and it is scrollable-->
        <div class="flex h-full flex-col gap-3 pt-2">
            <h2 class="text-center">Livres</h2>

            <div class="overflow-y-auto">
                <!--Loop through the books-->
                {#each data.books as book}
                    <!--Make the books have some space in between them-->
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-2 px-3">
                            <img src={book.src[0]} class="h-20 w-20" alt="Page couverture" />
                            <div class="flex flex-col">
                                <div>{book.title}</div>
                                <div class="text-sm text-gray-500">{book.author}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-3 px-5">
                            <a class="filled h-10 w-24" href="/livres/mes-livres"> Voir </a>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
