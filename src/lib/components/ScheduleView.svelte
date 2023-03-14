<script lang="ts">
    // Importation des types et bibliothèques nécessaires
    import type { Class } from "$lib/Types";
    import dayjs, { Dayjs } from "dayjs";
    import { onDestroy } from "svelte";
    import Hoverable from "./Hoverable.svelte";

    // TODO: Remplacer "schedule" par l'emploi du temps de l'utilisateur
    export let schedule: Class[];

    // Déclaration des propriétés
    let rowTitles: string[] = [];
    let weekStartDay = dayjs();
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

    // Mise à jour de l'heure actuelle toutes les 15 secondes
    const interval = setInterval(() => (currentTime = dayjs()), 15000);
    onDestroy(() => clearInterval(interval));

    // Fonction de déplacement d'une semaine en arrière ou en avant
    const moveWeek = (weeks: number) => (weekStartDay = weekStartDay.add(weeks, "weeks"));

    // Fonction qui permet de savoir si deux dayjs désigne le même jour
    const dateAreTheSame = (day1: Dayjs, day2: Dayjs) => {
        return (
            day1.year() === day2.year() &&
            day1.month() === day2.month() &&
            day1.date() === day2.date()
        );
    };
</script>

<!-- La section principale de la page -->
<main>
    <!-- Affiche la semaine en cours avec le jour de début et de fin -->
    Semaine du {weekStartDay.weekday(0).format("D")} au {weekStartDay
        .weekday(6)
        .format("D MMMM YYYY")}
    <!-- Boutons pour naviguer vers la semaine précédente ou suivante -->
    <button on:click={() => moveWeek(-1)}> Previous </button>
    <button on:click={() => moveWeek(1)}> Next </button>

    <!-- Tableau qui contiendra l'emploi du temps -->
    <table class="relative">
        <!-- Ligne pour les jours de la semaine -->
        <tr class="grid grid-cols-8" style={`height: ${rowHeight}rem;`}>
            <th
                class="translate-y-1/2 flex justify-center items-center"
                style={`width: ${cellWidth}rem;`}
            >
                {rowTitles[0]}
            </th>

            <!-- Boucle pour chaque jour de la semaine -->
            {#each [...Array(7)].map((_, i) => weekStartDay.weekday(i)) as day}
                <th>
                    <!-- Affiche le nom complet du jour -->
                    {day.format("dddd")}
                    <br />
                    {day.format("D")}

                    <!-- Boucle pour chaque période de l'emploi du temps -->
                    {#each schedule.filter((p) => dateAreTheSame(p.timeStart, day)) as period}
                        <!-- Ajoute une div "Hoverable" qui affiche des informations supplémentaires lorsqu'elle est survolée -->
                        <Hoverable let:hovering>
                            <div
                                class="absolute bg-sky-500 border-red-200 hover:border-2 "
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
                                <!-- Affiche les informations supplémentaires lorsqu'on survole la div -->
                                {#if hovering}
                                    <div
                                        class="absolute p-4 top-1/2 max-w-xs bg-blue-400 z-10"
                                        style={`transform: translate(${cellWidth}rem,-50%`}
                                    >
                                        <p class="text-center break-words">
                                            TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
                                            {period.name} <br />
                                            {period.group} <br />
                                            {period.local} <br />
                                            {period.type} <br />
                                            {period.teacher} <br />
                                            {period.virtual} <br />
                                            {period.timeStart} <br />
                                            {period.timeEnd}
                                        </p>
                                    </div>
                                {/if}
                                <!-- Affiche le nom de la période et son identifiant -->
                                <p class="truncate text-center">
                                    {period.name}<br />
                                    {period.group}
                                </p>
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
                                class="absolute rounded-full w-3 h-3 bg-red-600 -translate-x-1/2 -translate-y-1/2"
                            />
                            <hr class="border-[1.3px] border-red-600 -translate-y-1/2" />
                        </div>
                    {/if}
                </th>
            {/each}
        </tr>

        <!-- Boucle pour chaque heure de la journée -->
        {#each rowTitles.slice(1) as hour}
            <tr class="grid grid-cols-8" style={`height: ${rowHeight}rem;`}>
                <th class="translate-y-1/2 flex justify-center items-center">
                    {hour}
                </th>

                <!-- Ajouter des cases vides pour les autres jours de la semaine -->
                {#each Array(7) as _}
                    <td class="border" />
                {/each}
            </tr>
        {/each}
    </table>
</main>
