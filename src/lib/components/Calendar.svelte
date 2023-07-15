<script lang="ts">
    import classNames from "classnames";
    import dayjs, { Dayjs } from "dayjs";

    export let selectedDay = dayjs();
    // TODO
    export let selectionLength = 1;

    $: displayMonth = selectedDay;

    function getAllWeeks(currentDate: Dayjs) {
        return Array.from({ length: 6 }, (_, i) => currentDate.date(i * 7));
    }

    function getDaysOfWeek(week: Dayjs) {
        return Array.from({ length: 7 }, (_, i) => week.day(i));
    }
</script>

<div>
    <div class="flex h-10 items-center gap-1 px-2">
        <i class="bx bx-calendar text-lg" />

        <h4 class="h4 flex-1 px-2">{displayMonth.format("MMMM YYYY")}</h4>

        <button
            on:click={() => (displayMonth = displayMonth.add(-1, "month"))}
            class="btn-icon variant-glass-primary h-7 w-7"
        >
            <i class="bx bxs-chevron-left" />
        </button>

        <button
            on:click={() => (displayMonth = displayMonth.add(1, "month"))}
            class="btn-icon variant-glass-primary h-7 w-7"
        >
            <i class="bx bxs-chevron-right" />
        </button>
    </div>

    <table class="flex flex-col gap-1">
        {#each getAllWeeks(displayMonth) as week}
            <tr class="flex justify-between gap-1">
                {#each getDaysOfWeek(week) as day}
                    <td>
                        <button
                            on:click={() => (selectedDay = day)}
                            class={classNames("btn-icon h-8 w-8 hover:variant-glass-primary", {
                                "opacity-50": day.month() !== displayMonth.month(),
                                "!variant-filled-primary": day.isSame(selectedDay, "day"),
                                "variant-ghost-primary": day.isSame(dayjs(), "day"),
                            })}
                        >
                            {day.date()}
                        </button>
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
</div>
