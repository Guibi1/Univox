<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import type { Book, Class, User } from "$lib/Types";
    import dayjs from "dayjs";
    import mongoose from "mongoose";
    import friends from "$lib/stores/friends";

    let userNameOfSchedule: string = "L'horaire de : Master Chief";

    let schedule: Class[] = [
        {
            _id: new mongoose.Types.ObjectId(),
            code: "601-101-MQ",
            name: "Yey c'est le 2",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().date(2).hour(6).minute(0),
            timeEnd: dayjs().date(2).hour(8).minute(0),
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "601-101-MQ",
            name: "aName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().hour(14).minute(0),
            timeEnd: dayjs().hour(16).minute(0),
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "601-101-MQ",
            name: "BName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().weekday(6).hour(16).minute(30),
            timeEnd: dayjs().weekday(6).hour(20).minute(0),
        },
    ];

    let books: Book[] = [];

    //##############################################################################
    /*JE SUIS RENDU À FAIRE EN SORTE QUE LES GETTERS PRENNENT
    LE ID AU GENS SPÉCIFIQUE AVEC LA BASE DE DONNÉES
    
    IL FAUT AUSSI TROUVER UNE FAÇON DE METTRE DE GETTERS DANS stores/user et friends
    POUR NE PAS RÉÉCRIRE LE GETTERS DES USER DANS CETTE PAGE POUR RIEN*/
    //##############################################################################

    //Gets the schedule that needs to be shown (ex : if you click on your friends schedule, it will be shown)
    function getSchedule(_id: mongoose.Types.ObjectId) {
        schedule = [
            {
                _id: new mongoose.Types.ObjectId(),
                code: "bruh",
                name: "bruh",
                group: 105,
                local: "B-105",
                type: "L",
                teacher: "asdjkfwlbk",
                virtual: false,
                timeStart: dayjs().weekday(2).hour(8).minute(0),
                timeEnd: dayjs().weekday(2).hour(11).minute(0),
            },
            {
                _id: new mongoose.Types.ObjectId(),
                code: "you",
                name: "you",
                group: 105,
                local: "B-105",
                type: "L",
                teacher: "asdjkfwlbk",
                virtual: false,
                timeStart: dayjs().weekday(1).hour(10).minute(0),
                timeEnd: dayjs().weekday(1).hour(20).minute(0),
            },
            {
                _id: new mongoose.Types.ObjectId(),
                code: "stupid",
                name: "stupid",
                group: 105,
                local: "B-105",
                type: "L",
                teacher: "asdjkfwlbk",
                virtual: false,
                timeStart: dayjs().weekday(6).hour(20).minute(0),
                timeEnd: dayjs().weekday(6).hour(24).minute(0),
            },
        ];
    }

    function getProfil(_id: mongoose.Types.ObjectId) {
        //À REMPLIR
    }

    //Gets the name of the user from the schedule that is being shown
    function getUser(_id: mongoose.Types.ObjectId) {
        return {
            _id: new mongoose.Types.ObjectId(),
            da: "1234567",
            email: "no",
            firstName: "Leroy",
            lastName: "Jenkins",
            avatar: "Rabbit",
        };
    }
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
        <ScheduleView {schedule} />
    </div>
    <div class="flex flex-col gap-2">
        <h1 class="text-center">Amis</h1>
        <!--The friends list is in a box with a border and it is scrollable-->
        <div
            class="flex h-[20rem] flex-col gap-3 overflow-y-scroll rounded-md border-2 border-gray-300 p-3"
        >
            <!--Loop through the friends-->
            {#each $friends as ami}
                <!--Make the friends have some space in between them-->
                <div class="flex flex-row justify-between">
                    <div class="flex flex-row gap-2">
                        <img
                            src={getUser(new mongoose.Types.ObjectId()).avatar}
                            class="h-10 w-10 rounded-full"
                        />
                        <div class="flex flex-col">
                            <div>{ami.lastName + ", " + ami.firstName}</div>
                            <div class="text-sm text-gray-500">{ami.email}</div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <button
                            class="rounded bg-blue-primary px-4 py-2 font-bold hover:bg-blue-primary"
                            on:click={() => {
                                userNameOfSchedule =
                                    "L'horaire de : " +
                                    getUser(new mongoose.Types.ObjectId()).firstName +
                                    " " +
                                    getUser(new mongoose.Types.ObjectId()).lastName;
                                getSchedule(new mongoose.Types.ObjectId());
                            }}
                        >
                            Horaire
                        </button>
                        <button
                            class="rounded bg-blue-500 px-4 py-2 font-bold hover:bg-blue-700"
                            on:click={() => {
                                getProfil(new mongoose.Types.ObjectId());
                            }}
                        >
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
                            <img
                                src="https://www.gravatar.com/avatar"
                                class="h-10 w-10 rounded-full"
                            />
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
