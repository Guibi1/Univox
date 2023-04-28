<script lang="ts">
    import type { Schedule } from "$lib/Types";
    import { weekdayOffset } from "$lib/stores/firstDayOfTheWeek";
    import classNames from "classnames";
    import dayjs, { Dayjs } from "dayjs";
    import { onDestroy, onMount, tick } from "svelte";
    import SchedulePeriod from "./SchedulePeriod.svelte";

    export let schedule: Schedule;
    export let startDay = dayjs();
    export let daysToShow = 7;

    const rowHeight = 4;

    let currentTime = dayjs();
    let timeStart = Math.min(Math.max(currentTime.hour() - 3, 0), 16);
    let scheduleDiv: Element;

    // Mise à jour de l'heure actuelle toutes les 60 secondes
    let interval: NodeJS.Timer;
    onMount(async () => {
        interval = setInterval(() => (currentTime = dayjs()), 60000);

        // Small hack to always look at timeStart when loading the page (eliminates a small stutter)
        let hours = timeStart;
        timeStart = 0;
        await tick();
        scheduleDiv.scroll(0, rowHeight * 16 * hours);
    });
    onDestroy(() => clearInterval(interval));

    // Fonction de déplacement d'une semaine en arrière ou en avant
    const moveWeek = (weeks: number) => (startDay = startDay.add(weeks, "weeks"));

    function getPeriods(schedule: Schedule, day: Dayjs) {
        return schedule.periods
            .concat(schedule.classes)
            .filter((p) => p.timeStart.isSame(day, "day"));
    }

    function getDaysToShow(startDay: Dayjs) {
        if (daysToShow >= 7 || daysToShow <= 0) {
            return Array.from({ length: 7 }, (_, i) => startDay.day(i + $weekdayOffset));
        } else {
            return Array.from({ length: daysToShow }, (_, i) => startDay.add(i, "days"));
        }
    }

    function getTopOffset(time: Dayjs, timeStart: number) {
        return rowHeight * (time.hour() + time.minute() / 60 - timeStart);
    }
</script>

<div class="grid grid-rows-[min-content_min-content_1fr] overflow-hidden rounded-2xl bg-gray3">
    <div class="m-4 flex items-center justify-between">
        <!-- Display the current week with start and end days -->
        <p class="text-2xl">
            <b>
                {startDay.format("MMMM").charAt(0).toUpperCase() +
                    startDay.format("MMMM").slice(1).toLowerCase()}
            </b>

            {startDay.year()}
        </p>
        <!-- Buttons for navigating to the previous or next week -->
        <div class="flex h-8 items-stretch gap-0.5">
            <button on:click={() => moveWeek(-1)} class="rounded-lg bg-gray2">
                <i class="bx bxs-left-arrow w-8 text-sm" />
            </button>

            <button on:click={() => (startDay = dayjs())} class="rounded-lg bg-gray2 px-4">
                Aujourd'hui
            </button>

            <button on:click={() => moveWeek(1)} class="rounded-lg bg-gray2">
                <i class="bx bxs-right-arrow w-8 text-sm" />
            </button>
        </div>
    </div>

    <!-- Day header -->
    <div class="flex w-full gap-1">
        <div class="w-12" />

        {#each getDaysToShow(startDay) as day}
            <div class="flex flex-1 items-center gap-2 p-2 text-sm">
                {#if currentTime.isSame(day, "day")}
                    <div class="h-2 w-2 rounded-full bg-red-600" />
                {/if}

                {day.format("dd").charAt(0).toUpperCase() +
                    day.format("ddd D").slice(1).toLowerCase()}
            </div>
        {/each}

        <div class="invisible overflow-y-scroll opacity-0" />
    </div>

    <!-- Schedule -->
    <div bind:this={scheduleDiv} class="relative flex w-full overflow-x-hidden overflow-y-scroll">
        <!-- Time markers -->
        <div class="w-12">
            {#each Array.from({ length: 24 - timeStart }, (_, i) => timeStart + i) as hour}
                <div
                    class={classNames({ "text-transparent": hour === 0 })}
                    style={`height: ${rowHeight}rem`}
                >
                    <div class="-translate-y-1/2 pr-2 text-right text-xs">
                        {dayjs().hour(hour).format("H[h]")}
                    </div>
                </div>
            {/each}
        </div>

        <!-- Horizontal lines -->
        <div class="absolute left-12 right-0 h-0">
            {#each Array.from({ length: 24 - timeStart }) as _}
                <div
                    class="border-b bg-gray2 dark:border-gray3"
                    style={`height: ${rowHeight}rem`}
                />
            {/each}
        </div>

        <!-- Calendar -->
        {#each getDaysToShow(startDay) as day}
            <div
                class="relative min-w-0 flex-1 border-l-2 dark:border-gray3"
                style={`height: ${rowHeight * (24 - timeStart)}rem`}
            >
                <!-- Boucle pour chaque période de l'emploi du temps -->
                {#each getPeriods(schedule, day) as period}
                    <SchedulePeriod {period} {rowHeight} {timeStart} />
                {/each}

                <!-- Pointeur rouge sur l'heure et la date actuelles -->
                {#if currentTime.isSame(day, "day")}
                    <div
                        class="relative h-0"
                        style={`top: ${getTopOffset(currentTime, timeStart)}rem;`}
                    >
                        <div
                            class="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600"
                        />
                        <hr class="-translate-y-1/2 border-2 !border-red-600" />
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
