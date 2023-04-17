<script lang="ts">
    import schedule from "$lib/stores/schedule";
    import dayjs from "dayjs";

    let name = "";
    let day = 1;
    let startHour = 0;
    let startMinute = 0;
    let endHour = 0;
    let endMinute = 0;

    function handleSubmit(event: Event) {
        event.preventDefault();

        schedule.add({
            name,
            timeStart: dayjs().day(day).hour(startHour).minute(startMinute).millisecond(0),
            timeEnd: dayjs().hour(endHour).minute(endMinute).millisecond(0),
        });
    }
</script>

<form on:submit={handleSubmit}>
    <div class="flex flex-row space-x-4">
        <div class="flex flex-col">
            <label>
                Name:

                <input type="text" bind:value={name} />
            </label>
        </div>

        <div class="flex flex-col">
            <label>
                Day:

                <select bind:value={day}>
                    {#each Array.from(Array(31).keys()) as day}
                        <option value={day + 1}>{day + 1}</option>
                    {/each}
                </select>
            </label>
        </div>

        <div class="flex flex-col">
            <label>
                Start Time:

                <select bind:value={startHour}>
                    {#each Array.from(Array(24).keys()) as hour}
                        <option value={hour}>{hour}</option>
                    {/each}
                </select>

                <select bind:value={startMinute}>
                    {#each [0, 15, 30, 45] as minute}
                        <option value={minute}>{minute}</option>
                    {/each}
                </select>
            </label>
        </div>

        <div class="flex flex-col">
            <label>
                End Time:

                <select bind:value={endHour}>
                    {#each Array.from(Array(24).keys()) as hour}
                        <option value={hour}>{hour}</option>
                    {/each}
                </select>

                <select bind:value={endMinute}>
                    {#each [0, 15, 30, 45] as minute}
                        <option value={minute}>{minute}</option>
                    {/each}
                </select>
            </label>
        </div>
    </div>

    <button type="submit">Add Event</button>
</form>
