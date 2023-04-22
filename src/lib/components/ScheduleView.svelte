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

    let timeStart = 7;
    const rowHeight = 3;

    let currentTime = dayjs();
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

<div class="grid grid-rows-[min-content_1fr] overflow-hidden">
    <!-- Day header -->
    <div class="flex w-full before:w-2">
        <div class="w-12" />

        {#each getDaysToShow(startDay) as day}
            <div
                class="flex flex-1 flex-col items-center justify-center gap-1 border-b p-2 dark:border-neutral-400"
            >
                {day.format("dddd")}

                <span
                    class={classNames(
                        "flex h-10 w-10 items-center justify-center rounded-full text-2xl",
                        {
                            "bg-blue-primary": currentTime.isSame(day, "day"),
                        }
                    )}
                >
                    {day.format("D")}
                </span>
            </div>
        {/each}

        <div class="invisible overflow-y-scroll opacity-0" />
    </div>

    <!-- Schedule -->
    <div bind:this={scheduleDiv} class="grid grid-cols-[max-content_1fr] overflow-y-scroll">
        <!-- Time markers -->
        <div class="w-12">
            {#each Array.from({ length: 24 - timeStart }, (_, i) => timeStart + i) as hour}
                <div
                    class={classNames({ "text-transparent": hour === 0 })}
                    style={`height: ${rowHeight}rem`}
                >
                    <div class="-translate-y-1/2 pr-2 text-right text-xs">
                        {dayjs().hour(hour).format("h A")}
                    </div>
                </div>
            {/each}
        </div>

        <!-- Calendar -->
        <div class="grid grid-rows-[0_1fr]">
            <!-- Horizontal lines -->
            <div>
                {#each Array.from({ length: 24 - timeStart }) as _}
                    <div
                        class="border-b dark:border-neutral-500"
                        style={`height: ${rowHeight}rem`}
                    />
                {/each}
            </div>

            <div class="inline-flex w-full before:w-2">
                {#each getDaysToShow(startDay) as day}
                    <div
                        class="relative min-w-0 flex-1 border-l dark:border-neutral-400"
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
    </div>
</div>
