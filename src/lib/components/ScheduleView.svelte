<script lang="ts">
    import type { Class } from "$lib/Types";

    export let schedule: Class[];

    const rowHeight = 3;
    const cellWidth = 6;
    const timeOffset = 5;
    const rowTitles = [
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
    ];

    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
</script>

<!-- TODO: Style -->
<main>
    <table class="relative">
        <tr style={`height: ${rowHeight}rem;`}>
            <th style={`width: ${cellWidth}rem;`}>Heures</th>

            {#each daysOfWeek as day}
                <th style={`width: ${cellWidth}rem;`}>
                    {day}
                </th>
            {/each}
        </tr>

        {#each rowTitles as hour}
            <tr style={`height: ${rowHeight}rem;`}>
                <th>{hour}</th>

                {#each daysOfWeek as _}
                    <th class="border" />
                {/each}
            </tr>
        {/each}

        <!-- TODO: Replace schedule for the user's schedule -->
        {#each schedule as period}
            <div
                class="absolute bg-neutral-400"
                style={`top: ${
                    rowHeight *
                    (period.timeStart.hour() + period.timeStart.minute() / 60 - timeOffset)
                }rem; 
                left: ${cellWidth * (period.weekday + 1)}rem;
                width: ${cellWidth}rem;
                height: ${rowHeight * period.timeEnd.diff(period.timeStart, "hour")}rem;`}
            >
                <p>{period.name}</p>
                <p>{period.id}</p>
                <p>{period.group}</p>
            </div>
        {/each}
    </table>
</main>
