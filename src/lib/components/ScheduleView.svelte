<script lang="ts">
    import type { Class } from "$lib/Types";
    import dayjs from "dayjs";
    import { onDestroy } from "svelte";
    import Hoverable from "./Hoverable.svelte";

    export let schedule: Class[];

    let rowTitles: string[] = [];

    const scheduleTimeStart = 0;
    const scheduleTimeEnd = 24;
    for (let i = scheduleTimeStart; i <= scheduleTimeEnd; i++) {
        rowTitles.push(i + ":00");
    }

    const rowHeight = 3;
    const cellWidth = 6;
    const timeOffset = scheduleTimeStart - 1;

    let currentTime = dayjs();
    const interval = setInterval(() => (currentTime = dayjs()), 1000);
    onDestroy(() => clearInterval(interval));

    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
</script>

<!-- TODO: Style -->
<main>
    <table class="relative">
        <tr style={`height: ${rowHeight}rem;`}>
            <th style={`width: ${cellWidth}rem;`} />

            {#each daysOfWeek as day}
                <th style={`width: ${cellWidth}rem;`}>
                    {day}
                </th>
            {/each}
        </tr>

        {#each rowTitles as hour, i}
            <tr style={`height: ${rowHeight}rem;`}>
                <th class="-translate-y-1/2">{hour}</th>

                {#if i < rowTitles.length - 1}
                    {#each daysOfWeek as _}
                        <th class="border border-neutral-400 dark:border-white" />
                    {/each}
                {/if}
            </tr>
        {/each}

        <!-- TODO: Replace schedule for the user's schedule -->
        {#each schedule as period}
            <Hoverable let:hovering>
                <div
                    class="absolute bg-sky-500"
                    style={`top: ${
                        rowHeight *
                        (period.timeStart.hour() + period.timeStart.minute() / 60 - timeOffset)
                    }rem; 
                    left: ${cellWidth * (period.weekday + 1)}rem;
                    width: ${cellWidth}rem;
                    height: ${
                        rowHeight * (period.timeEnd.diff(period.timeStart, "minute") / 60)
                    }rem;`}
                >
                    <!-- On Hover -->
                    {#if hovering}
                        <div
                            class="absolute w-auto h-auto bg-black"
                            style={`transform: translateX(${cellWidth}rem);`}
                        >
                            {period.name} <br />
                            {period._id} <br />
                            {period.group} <br />
                            {period.local} <br />
                            {period.type} <br />
                            {period.teacher} <br />
                            {period.virtual} <br />
                            {period.weekday} <br />
                            {period.timeStart} <br />
                            {period.timeEnd}
                        </div>
                    {/if}

                    <p>{period.name}</p>
                    <p>{period._id}</p>
                    <p>{period.group}</p>
                </div>
            </Hoverable>
        {/each}

        <!-- Pointer date/time -->
        <div
            class="absolute"
            style={`top: ${
                rowHeight * (currentTime.hour() + currentTime.minute() / 60 - timeOffset)
            }rem; left: ${cellWidth * currentTime.day()}rem; width: ${cellWidth}rem;`}
        >
            <div
                class="absolute rounded-full w-3 h-3 bg-red-600 -translate-x-1/2 -translate-y-1/2"
            />
            <hr class="border-2 !border-red-600 -translate-y-1/2" />
        </div>
    </table>
</main>
