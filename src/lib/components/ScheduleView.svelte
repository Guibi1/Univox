<script lang="ts">
    // Importation des types et bibliothèques nécessaires
    import type { Class } from "$lib/Types";
    import dayjs from "dayjs";
    import { onDestroy } from "svelte";
    import Hoverable from "./Hoverable.svelte";

    // Déclaration des propriétés
    export let schedule: Class[];
    let rowTitles: string[] = [];
    let weekStartDay = dayjs().date(25);
    let currentTime = dayjs();

    // Définition des constantes
    const scheduleTimeStart = 0;
    const scheduleTimeEnd = 24;
    const rowHeight = 3;
    const cellWidth = 6;
    const timeOffset = scheduleTimeStart - 1;
    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    // Génération des heures de début de chaque ligne
    for (let i = scheduleTimeStart; i <= scheduleTimeEnd; i++) {
        rowTitles.push(i + ":00");
    }

    // Mise à jour de l'heure actuelle toutes les secondes
    const interval = setInterval(() => (currentTime = dayjs()), 1000);
    onDestroy(() => clearInterval(interval));

    // Fonction de déplacement d'une semaine en arrière ou en avant
    const moveWeek = (weeks: number) => {
        weekStartDay = weekStartDay.add(weeks, "weeks");
    };
</script>

<!-- La section principale de la page -->
<main>
    <!-- Affiche la semaine en cours avec le jour de début et de fin -->
    Semaine {weekStartDay.weekday(0).format("MMMM")} à {weekStartDay.weekday(6).date()}
    {weekStartDay.month()}
    <!-- Boutons pour naviguer vers la semaine précédente ou suivante -->
    <button on:click={() => moveWeek(-1)}> Previous </button>
    <button on:click={() => moveWeek(1)}> Next </button>

    <!-- Tableau qui contiendra l'emploi du temps -->
    <table class="relative">
        <!-- Ligne pour les jours de la semaine -->
        <tr style={`height: ${rowHeight}rem;`}>
            <th style={`width: ${cellWidth}rem;`} />

            <!-- Boucle pour chaque jour de la semaine -->
            {#each Array(7) as day, i}
                <th style={`width: ${cellWidth}rem;`}>
                    <!-- Affiche le nom complet du jour -->
                    {dayjs().weekday(i).format("dddd")}
                </th>
            {/each}
        </tr>

        <!-- Boucle pour chaque heure de la journée -->
        {#each rowTitles as hour, i}
            <tr style={`height: ${rowHeight}rem;`}>
                <th class="-translate-y-1/2">{hour}</th>

                <!-- Si ce n'est pas la dernière heure de la journée, ajouter des cases vides pour les autres jours de la semaine -->
                {#if i < rowTitles.length - 1}
                    {#each daysOfWeek as _}
                        <th class="border" />
                    {/each}
                {/if}
            </tr>
        {/each}

        <!-- TODO: Remplacer "schedule" par l'emploi du temps de l'utilisateur -->
        <!-- Boucle pour chaque période de l'emploi du temps -->
        {#each schedule as period}
            <!-- Ajoute une div "Hoverable" qui affiche des informations supplémentaires lorsqu'elle est survolée -->
            <Hoverable let:hovering>
                <div
                    class="absolute bg-sky-500 border-red-200 truncate hover:border-2 "
                    style={`top: ${
                        rowHeight *
                        (period.timeStart.hour() + period.timeStart.minute() / 60 - timeOffset)
                    }rem; 
                left: ${cellWidth * period.timeStart.weekday()}rem;
                width: ${cellWidth}rem;
                height: ${rowHeight * (period.timeEnd.diff(period.timeStart, "minute") / 60)}rem;`}
                >
                    <!-- Affiche les informations supplémentaires lorsqu'on survole la div -->
                    {#if hovering}
                        <div
                            class="absolute p-4 top-1/2 bg-blue-400 z-10"
                            style={`transform: translate(${cellWidth}rem,-50%`}
                        >
                            <p class="text-center">
                                h<br />
                                {period.name} <br />
                                {period._id} <br />
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
                    <p>{period.name}</p>
                    <p>{period._id}</p>
                    <p>{period.group}</p>
                </div>
            </Hoverable>
        {/each}

        <!-- Pointeur rouge sur l'heure et la date actuelles -->
        <div
            class="absolute"
            style={`top: ${
                rowHeight * (currentTime.hour() + currentTime.minute() / 60 - timeOffset)
            }rem; left: ${cellWidth * currentTime.day()}rem; width: ${cellWidth}rem;`}
        >
            <!-- La marque est un cercle rouge et une ligne rouge -->
            <div
                class="absolute rounded-full w-3 h-3 bg-red-600 -translate-x-1/2 -translate-y-1/2"
            />
            <hr class="border-[1.3px] border-red-600 -translate-y-1/2" />
        </div>
    </table>
</main>
