<script lang="ts">
    import dayjs from "dayjs";
    import { createEventDispatcher } from "svelte";
    import type { Period } from "$lib/Types";

    const dispatch = createEventDispatcher();

    let name = "";
    let timeStart = dayjs().hour(0).minute(0);
    let timeEnd = dayjs().hour(1).minute(0);

    function handleSubmit(event: Event) {
        event.preventDefault();
        const period: Period = {
            name,
            timeStart,
            timeEnd,
        };
        dispatch("submit", period);
    }
</script>

<form on:submit={handleSubmit}>
    <div class="flex flex-row space-x-4 text-blue-900">
        <div class="flex flex-col">
            <label for="name">Name:</label>
            <input type="text" id="name" bind:value={name} />
        </div>
        <div class="flex flex-col">
            <label for="day">Day:</label>
            <select id="day" bind:value={timeStart.day}>
                {#each Array.from(Array(31).keys()) as day}
                    <option value={day + 1}>{day + 1}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col">
            <label for="start">Start Time:</label>
            <select id="start" bind:value={timeStart.hour}>
                {#each Array.from(Array(24).keys()) as hour}
                    <option value={hour}>{hour}</option>
                {/each}
            </select>
            <select id="start-minute" bind:value={timeStart.minute}>
                {#each [0, 15, 30, 45] as minute}
                    <option value={minute}>{minute}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col">
            <label for="end">End Time:</label>
            <select id="end" bind:value={timeEnd.hour}>
                {#each Array.from(Array(24).keys()) as hour}
                    <option value={hour}>{hour}</option>
                {/each}
            </select>
            <select id="end-minute" bind:value={timeEnd.minute}>
                {#each [0, 15, 30, 45] as minute}
                    <option value={minute}>{minute}</option>
                {/each}
            </select>
        </div>
    </div>
    <button type="submit">Add Event</button>
</form>
