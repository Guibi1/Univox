<script lang="ts">
    import type { Class, Period } from "$lib/Types";
    import schedule from "$lib/stores/schedule";
    import classNames from "classnames";

    export let period: Period | Class;
    export let rowHeight: number;
    export let timeStart: number;
    export let isRight = true;
    export let canBeDeleted: boolean = false;

    let tooltipY = 0;

    export function getTopOffset(p: Period, timeStart: number) {
        return rowHeight * (p.timeStart.hour() + p.timeStart.minute() / 60 - timeStart);
    }

    function getHeight(p: Period) {
        return rowHeight * (p.timeEnd.diff(p.timeStart, "minute") / 60) - 0.15;
    }

    function handleMousemove(event: MouseEvent) {
        tooltipY = event.clientY - (event.currentTarget! as Element).getBoundingClientRect().top;
    }
</script>

<div
    class="group relative m-0 h-0 w-full min-w-0"
    style={`top: ${getTopOffset(period, timeStart)}rem;`}
    on:mousemove={handleMousemove}
>
    <div
        class={classNames(
            "mx-0.5 flex flex-col justify-between text-ellipsis rounded-lg bg-blue-primary px-2 text-center",
            getHeight(period) >= rowHeight * 1.9 ? "py-4" : "py-2"
        )}
        style={`height: ${getHeight(period)}rem;`}
    >
        <div class="flex flex-col gap-2">
            <span class={classNames("text-sm", { truncate: getHeight(period) < rowHeight * 2.5 })}>
                {period.name}
            </span>

            {#if getHeight(period) >= rowHeight * 1.5}
                <span class="text-xs">
                    {period.timeStart.format("HH:mm")} - {period.timeEnd.format("HH:mm")}
                </span>
            {/if}
        </div>

        <!-- If is a Class -->
        {#if "group" in period}
            <div class="flex flex-row items-center justify-around">
                {#if period.virtual}
                    <i class="bx bx-desktop text-lg" />
                {:else}
                    <span class="text-sm">{period.local}</span>
                {/if}

                {#if !period.theory}
                    <i class="bx bxs-flask text-lg" />
                {/if}
            </div>
        {:else if canBeDeleted}
            <button on:click={() => schedule.remove(period)}>
                <i class="bx bx-trash cursor-pointer text-xl text-red-500" />
            </button>
        {/if}

        <!-- Affiche les informations supplémentaires lorsqu'on survole le div -->
        <div
            class={classNames(
                "pointer-events-none absolute z-10 mx-2 hidden w-max flex-col rounded border-2 border-blue-primary bg-zinc-700 p-4 text-left group-hover:flex",
                isRight ? "right-full" : "left-full"
            )}
            style={`top: ${tooltipY}px;`}
        >
            {period.name}

            {#if "group" in period}
                <small>
                    Gr. {`${period.group}`.padStart(5, "0")} - <i>{period.code}</i>
                </small>
            {/if}

            <div class="grid grid-cols-[min-content_1fr] items-center gap-2">
                <i class="bx bx-time-five text-2xl" />
                <span>
                    {period.timeStart.format("dddd DD MMMM • H[h]mm")} à
                    {period.timeEnd.format("H[h]mm")}
                </span>

                <!-- If is a Class -->
                {#if "group" in period}
                    {#if period.virtual}
                        <i class="bx bx-desktop text-2xl" />
                        Virtuel
                    {:else}
                        <i class="bx bx-chalkboard text-2xl" />
                        Local {period.local}
                    {/if}

                    {#if !period.theory}
                        <i class="bx bxs-flask text-2xl" />
                        Laboratoire
                    {/if}

                    <i class="bx bx-male text-2xl" />
                    {period.teacher}
                {/if}
            </div>
        </div>
    </div>
</div>
