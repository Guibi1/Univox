<script lang="ts">
    import type { Schedule } from "$lib/Types";
    import { dateAreTheSame, weekdayOffset } from "$lib/stores/firstDayOfTheWeek";
    import dayjs from "dayjs";
    import { onDestroy } from "svelte";
    import Hoverable from "./Hoverable.svelte";

    export let schedule: Schedule;
    export let currentWeek = dayjs();

    // Déclaration des propriétés
    let rowTitles: string[] = [];
    let currentTime = dayjs();

    // Définition des constantes
    const scheduleTimeStart = 0;
    const scheduleTimeEnd = 24;
    const rowHeight = 3;
    const cellWidth = 6;

    const timeOffset = scheduleTimeStart - 1;

    // Génération des heures de début de chaque ligne
    for (let i = scheduleTimeStart; i <= scheduleTimeEnd; i++) {
        rowTitles.push(i + ":00");
    }

    // Mise à jour de l'heure actuelle toutes les 60 secondes
    const interval = setInterval(() => (currentTime = dayjs()), 60000);
    onDestroy(() => clearInterval(interval));
</script>

<!-- Tableau qui contiendra l'emploi du temps -->
<table class="relative">
    <!-- Ligne pour les jours de la semaine -->
    <tr class="grid grid-cols-8" style={`height: ${rowHeight}rem;`}>
        <th
            class="flex translate-y-1/2 items-center justify-center"
            style={`width: ${cellWidth}rem;`}
        >
            {rowTitles[0]}
        </th>

        <!-- Boucle pour chaque jour de la semaine -->
        {#each [...Array(7)].map((_, i) => currentWeek.weekday(i + $weekdayOffset)) as day}
            <th>
                <!-- Affiche le nom complet du jour -->
                {day.format("dddd")}
                <br />
                {day.format("D")}

                <!-- Boucle pour chaque période de l'emploi du temps -->
                {#each schedule.periods.filter((p) => dateAreTheSame(p.timeStart, day)) as period}
                    <!-- Ajoute une div "Hoverable" qui affiche des informations supplémentaires lorsqu'elle est survolée -->
                    <Hoverable let:hovering>
                        <div
                            class="absolute border-red-200 bg-sky-500 hover:border-2"
                            style={`top: ${
                                rowHeight *
                                (period.timeStart.hour() +
                                    period.timeStart.minute() / 60 -
                                    timeOffset)
                            }rem; 
                                width: ${cellWidth}rem;
                                height: ${
                                    rowHeight *
                                    (period.timeEnd.diff(period.timeStart, "minute") / 60)
                                }rem;`}
                        >
                            <p class="truncate text-center">
                                {period.name}
                            </p>

                            <!-- Affiche les informations supplémentaires lorsqu'on survole la div -->
                            {#if hovering}
                                <div
                                    class="absolute top-1/2 z-10 max-w-xs bg-blue-400 p-4"
                                    style={`transform: translate(${cellWidth}rem,-50%`}
                                >
                                    <p class="break-words text-center">
                                        {period.name} <br />
                                        <br />
                                        {period.timeStart} <br />
                                        {period.timeEnd}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </Hoverable>
                {/each}

                <!-- Boucle pour chaque période de l'emploi du temps -->
                {#each schedule.classes.filter((p) => dateAreTheSame(p.timeStart, day)) as period}
                    <!-- Ajoute une div "Hoverable" qui affiche des informations supplémentaires lorsqu'elle est survolée -->
                    <Hoverable let:hovering>
                        <div
                            class="absolute border-red-200 bg-sky-500 hover:border-2"
                            style={`top: ${
                                rowHeight *
                                (period.timeStart.hour() +
                                    period.timeStart.minute() / 60 -
                                    timeOffset)
                            }rem; 
                                width: ${cellWidth}rem;
                                height: ${
                                    rowHeight *
                                    (period.timeEnd.diff(period.timeStart, "minute") / 60)
                                }rem;`}
                        >
                            <p class="truncate text-center">
                                {period.name}<br />
                                {period.group}
                            </p>

                            <!-- Affiche les informations supplémentaires lorsqu'on survole la div -->
                            {#if hovering}
                                <div
                                    class="absolute top-1/2 z-10 max-w-xs bg-blue-400 p-4"
                                    style={`transform: translate(${cellWidth}rem,-50%`}
                                >
                                    <p class="break-words text-center">
                                        {period.name} <br />
                                        {period.group} <br />
                                        {period.local} <br />
                                        <br />
                                        {period.teacher} <br />
                                        {period.virtual} <br />
                                        {period.timeStart} <br />
                                        {period.timeEnd}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </Hoverable>
                {/each}

                <!-- Pointeur rouge sur l'heure et la date actuelles -->
                {#if dateAreTheSame(currentTime, day)}
                    <div
                        class="absolute"
                        style={`top: ${
                            rowHeight *
                            (currentTime.hour() + currentTime.minute() / 60 - timeOffset)
                        }rem; width: ${cellWidth}rem;`}
                    >
                        <!-- La marque est un cercle rouge et une ligne rouge -->
                        <div
                            class="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600"
                        />
                        <hr class="-translate-y-1/2 border-2 !border-red-600" />
                    </div>
                {/if}
            </th>
        {/each}
    </tr>

    <!-- Boucle pour chaque heure de la journée -->
    {#each rowTitles.slice(1) as hour}
        <tr class="grid grid-cols-8" style={`height: ${rowHeight}rem;`}>
            <th class="flex translate-y-1/2 items-center justify-center">
                {hour}
            </th>

            <!-- Ajouter des cases vides pour les autres jours de la semaine -->
            {#each Array(7) as _}
                <td class="border border-neutral-400 dark:border-white" />
            {/each}
        </tr>
    {/each}
</table>
