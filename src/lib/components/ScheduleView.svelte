<script lang="ts">
    import type { Class } from "$lib/Types";
    import dayjs, { Dayjs } from "dayjs";

    export let schedule: Class[];

    const rowHeight = 3;
    const hourOffset = 3;
    const cellWidth = 6;
    const timeOffset = 5;
    let rowTitles: string[] = [];

    const scheduleTimeStart = 6;
    const scheduleTimeEnd = 21;
    for (let i = scheduleTimeStart; i <= scheduleTimeEnd; i++) {
        rowTitles[i - scheduleTimeStart] = i + ":00";
    }

    console.log(dayjs().day())

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
                        <th class="border" />
                    {/each}
                {/if}
            </tr>
        {/each}

        <!-- TODO: Replace schedule for the user's schedule -->
        {#each schedule as period}
            <div
                class="absolute bg-sky-500  "
                style={`top: ${
                    rowHeight *
                    (period.timeStart.hour() + period.timeStart.minute() / 60 - timeOffset)
                }rem; 
                left: ${cellWidth * (period.weekday + 1)}rem;
                width: ${cellWidth}rem;
                height: ${rowHeight * (period.timeEnd.diff(period.timeStart, "minute") / 60)}rem;`}
            >
                <p>{period.name}</p>
                <p>{period.id}</p>
                <p>{period.group}</p>
            </div>
        {/each}

        <!-- Pointer date/time -->

        <hr
            class="absolute h-px bg-red-600 border-0 dark:bg-red-600"
            style={`top: ${rowHeight * (dayjs().hour() + dayjs().minute() / 60 - timeOffset)}rem; 
        left: ${cellWidth * (dayjs().day())}rem;
        width: ${cellWidth}rem;`}
        />

        <div class="absolute rounded-full w-3 h-3 bg-red-600" 
        style={`top: ${rowHeight * (dayjs().hour() + dayjs().minute() / 60 - timeOffset) - 0.3}rem; 
        left: ${cellWidth * dayjs().day() - 0.3}rem;
        `}></div>
    </table>
</main>
