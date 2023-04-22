<script lang="ts">
    import type { Schedule } from "$lib/Types";
    import { dateAreTheSame, weekdayOffset } from "$lib/stores/firstDayOfTheWeek";
    import dayjs, { Dayjs } from "dayjs";
    import { onDestroy } from "svelte";
    import SchedulePeriod from "./SchedulePeriod.svelte";

    export let schedule: Schedule;
    export let currentWeek = dayjs();

    // Déclaration des propriétés
    let rowTitles: string[] = [];
    let currentTime = dayjs();

    // Définition des constantes
    const scheduleTimeStart = 6;
    const scheduleTimeEnd = 20;
    const rowHeight = 6;

    const timeOffset = scheduleTimeStart - 1;

    // Génération des heures de début de chaque ligne
    for (let i = scheduleTimeStart; i <= scheduleTimeEnd; i++) {
        rowTitles.push(i + ":00");
    }

    // Mise à jour de l'heure actuelle toutes les 60 secondes
    const interval = setInterval(() => (currentTime = dayjs()), 60000);
    onDestroy(() => clearInterval(interval));

    function getPeriods(day: Dayjs) {
        return schedule.periods
            .concat(schedule.classes)
            .filter((p) => dateAreTheSame(p.timeStart, day));
    }

    function getDaysOfWeek(week: Dayjs) {
        return Array.from({ length: 7 }, (_, i) => week.day(i + $weekdayOffset));
    }

    function getCurrentTimeTopOffset() {
        return rowHeight * (currentTime.hour() + currentTime.minute() / 60 - timeOffset);
    }
</script>

<div class="flex flex-col">
    <!-- Day header -->
    <div class="grid grid-cols-[max-content_1fr]">
        <div class="w-10" />

        <div class="grid w-full grid-cols-7 border-b dark:border-neutral-400">
            {#each getDaysOfWeek(currentWeek) as day}
                <div class="flex flex-col items-center gap-2 p-4">
                    {day.format("dddd")}

                    <span class="text-2xl">
                        {day.format("D")}
                    </span>
                </div>
            {/each}
        </div>
    </div>

    <div class="grid h-[35rem] grid-cols-[max-content_1fr] overflow-y-scroll">
        <!-- Time marks -->
        <div class="w-10">
            {#each Array.from({ length: scheduleTimeEnd - scheduleTimeStart }, (_, i) => scheduleTimeStart + i) as hour}
                <div class="first:text-transparent" style={`height: ${rowHeight}rem`}>
                    <div class="-translate-y-1/2 text-xs">
                        {dayjs().hour(hour).format("h A")}
                    </div>
                </div>
            {/each}
        </div>

        <!-- Calendar -->
        <div class="grid grid-cols-7">
            {#each getDaysOfWeek(currentWeek) as day}
                <div
                    class="relative border-l dark:border-neutral-400"
                    style={`height: ${rowHeight * (scheduleTimeEnd - scheduleTimeStart)}rem`}
                >
                    <!-- Boucle pour chaque période de l'emploi du temps -->
                    {#each getPeriods(day) as period}
                        <SchedulePeriod {period} {rowHeight} {timeOffset} />
                    {/each}

                    <!-- Pointeur rouge sur l'heure et la date actuelles -->
                    {#if dateAreTheSame(currentTime, day)}
                        <div class="relative h-0" style={`top: ${getCurrentTimeTopOffset()}rem;`}>
                            <div
                                class="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600"
                            />
                            <hr class="-translate-y-1/2 border-2 !border-red-600" />
                        </div>
                    {/if}

                    {#each Array.from({ length: scheduleTimeEnd - scheduleTimeStart }) as _}
                        <div
                            class="border-b dark:border-neutral-700"
                            style={`height: ${rowHeight}rem`}
                        />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
