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
    <div class="flex h-10 items-center gap-2 px-2">
        <i class="bx bx-calendar" />

        <h3 class="flex-1">{displayMonth.format("MMMM YYYY")}</h3>

        <button
            on:click={() => (displayMonth = displayMonth.add(-1, "month"))}
            class="rounded-full"
        >
            <i class="bx bxs-chevron-left" />
        </button>
        <button on:click={() => (displayMonth = displayMonth.add(1, "month"))} class="rounded-full">
            <i class="bx bxs-chevron-right" />
        </button>
    </div>

    <table class="flex flex-col">
        {#each getAllWeeks(displayMonth) as week}
            <tr class="flex justify-between">
                {#each getDaysOfWeek(week) as day}
                    <td class="grid">
                        <button
                            on:click={() => (selectedDay = day)}
                            class={classNames(
                                "flex h-8 w-8 items-center justify-center rounded-full hover:bg-black",
                                {
                                    "opacity-40": day.month() !== displayMonth.month(),
                                    "bg-neutral-900": day.isSame(selectedDay, "day"),
                                    "!bg-blue-primary": day.isSame(dayjs(), "day"),
                                }
                            )}
                        >
                            {day.date()}
                        </button>
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
</div>
