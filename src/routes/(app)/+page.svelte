<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import type { Book, Class, Schedule, User } from "$lib/Types";
    import dayjs from "dayjs";
    import mongoose from "mongoose";
    import friends from "$lib/stores/friends";
    import Avatar from "$lib/components/Avatar.svelte";
    import user from "$lib/stores/user";

    let userNameOfSchedule: string = "L'horaire de : Master Chief";

    let books: Book[] = [
        {
            _id: new mongoose.Types.ObjectId(),
            code: "hello",
            sellerId: new mongoose.Types.ObjectId(),
            title: "Bruh",
            ISBN: "Ok",
            src: [
                "https://en.wikipedia.org/wiki/Image#/media/File:Image_created_with_a_mobile_phone.png",
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
    <div class="flex flex-col gap-2">
        <h1 class="text-center">Amis</h1>
        <!--The friends list is in a box with a border and it is scrollable-->
        <div
            class="flex h-[20rem] flex-col gap-3 overflow-y-scroll rounded-md border-2 border-gray-300 p-3"
        >
            <!--Loop through the friends-->
            {#each $friends as friend}
                <!--Make the friends have some space in between them-->
                <div class="flex flex-row justify-between">
                    <div class="flex flex-row gap-2">
                        <div class="h-10 w-10"><Avatar /></div>
                        <div class="flex flex-col">
                            <div>{friend.lastName + ", " + friend.firstName}</div>
                            <div class="text-sm text-gray-500">{friend.email}</div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <button
                            class="rounded bg-blue-primary px-4 py-2 font-bold hover:bg-blue-primary"
                            on:click={() => {
                                userNameOfSchedule =
                                    "L'horaire de : " + $user.firstName + " " + $user.lastName;
                            }}
                        >
                            Horaire
                        </button>
                        <button class="rounded bg-blue-500 px-4 py-2 font-bold hover:bg-blue-700">
                            Profil
                        </button>
                    </div>
                </div>
            {/each}
        </div>
        <!--Place to see the books you are buying and selling (both with a slight separation) which is under the friend list-->
        <div class="flex flex-col gap-2">
            <h1 class="text-center">Livres en vente</h1>
            <!--The books list is in a box with a border and it is scrollable-->
            <div
                class="flex h-[20rem] flex-col gap-3 overflow-y-scroll rounded-md border-2 border-gray-300 p-3"
            >
                <!--Loop through the books-->
                {#each books as book}
                    <!--Make the books have some space in between them-->
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-2">
                            <img src={book.src[0]} class="h-10 w-10 rounded-full" />
                            <div class="flex flex-col">
                                <div>{book.title}</div>
                                <div class="text-sm text-gray-500">{book.author}</div>
                            </div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <button
                                class="rounded bg-blue-primary px-4 py-2 font-bold hover:bg-blue-primary"
                            >
                                Voir
                            </button>
                            <button
                                class="rounded bg-blue-500 px-4 py-2 font-bold hover:bg-blue-700"
                            >
                                Acheter
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
