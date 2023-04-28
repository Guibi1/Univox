<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import type { Book, Class, Schedule, User } from "$lib/Types";
    import dayjs from "dayjs";
    import mongoose from "mongoose";
    import friends from "$lib/stores/friends";
    import Avatar from "$lib/components/Avatar.svelte";
    import user from "$lib/stores/user";

    let userNameOfSchedule: string = "L'horaire de : Master Chief";

    //----------------------
    //let books for testing
    //----------------------
    let books: Book[] = [
        {
            _id: new mongoose.Types.ObjectId(),
            code: "hello",
            sellerId: new mongoose.Types.ObjectId(),
            title: "Bruh",
            ISBN: "Ok",
            src: [
                "data:image/png;base64,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",
            ],
            author: "Amogus",
            price: 69,
            state: "Available",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "hello",
            sellerId: new mongoose.Types.ObjectId(),
            title: "Bruh",
            ISBN: "Ok",
            src: [
                "data:image/png;base64,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",
            ],
            author: "Amogus",
            price: 69,
            state: "Available",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "hello",
            sellerId: new mongoose.Types.ObjectId(),
            title: "Bruh",
            ISBN: "Ok",
            src: [
                "data:image/png;base64,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",
            ],
            author: "Amogus",
            price: 69,
            state: "Available",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "hello",
            sellerId: new mongoose.Types.ObjectId(),
            title: "Bruh",
            ISBN: "Ok",
            src: [
                "data:image/png;base64,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",
            ],
            author: "Amogus",
            price: 69,
            state: "Available",
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "hello",
            sellerId: new mongoose.Types.ObjectId(),
            title: "Bruh",
            ISBN: "Ok",
            src: [
                "data:image/png;base64,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",
            ],
            author: "Amogus",
            price: 69,
            state: "Available",
        },
    ];
</script>

<svelte:head>
    <title>Univox</title>
</svelte:head>

<!--The friend list is in a box with a border that takes the top half of the right part of the screen-->

<!--The schedule takes all of the left part of the screen it is in a grid with two colomns with also the friend list in that-->

<div class="grid grid-cols-2 gap-2">
    <div class="flex flex-col gap-2">
        <h1 class="text-center font-bold">{userNameOfSchedule}</h1>
        <!--This is where the schedule is-->
        <!--<ScheduleView {schedule} />--->
    </div>

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
                            on:click={() => {
                                userNameOfSchedule =
                                    "L'horaire de : " + $user.firstName + " " + $user.lastName;
                            }}
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
