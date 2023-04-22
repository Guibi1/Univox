<script lang="ts">
    import type { Class, Period } from "$lib/Types";
    import cx from "classnames";

    export let period: Period | Class;
    export let rowHeight: number;
    export let timeOffset: number;

    let hovering: boolean;

    export function getTopOffset() {
        return rowHeight * (period.timeStart.hour() + period.timeStart.minute() / 60 - timeOffset);
    }

    function getHeight() {
        return rowHeight * (period.timeEnd.diff(period.timeStart, "minute") / 60) - 0.15;
    }
</script>

<div class="relative m-0 h-0" style={`top: ${getTopOffset()}rem;`}>
    <div
        class="mx-0.5 flex flex-col justify-between text-ellipsis rounded-lg bg-blue-primary px-2 py-4 text-center"
        style={`height: ${getHeight()}rem;`}
        on:mouseenter={() => (hovering = true)}
        on:mouseleave={() => (hovering = false)}
    >
        <div class="flex flex-col gap-2">
            <span class={cx("text-sm", { truncate: getHeight() < rowHeight * 2.5 })}>
                {period.name}
            </span>

            {#if getHeight() >= rowHeight * 1.5}
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
        {/if}

        <!-- Affiche les informations supplémentaires lorsqu'on survole le div -->
        {#if hovering}
            <div
                class="absolute left-full z-10 ml-2 flex w-max flex-col rounded border-2 border-blue-primary bg-zinc-700 p-4 text-left"
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
        {/if}
    </div>
</div>