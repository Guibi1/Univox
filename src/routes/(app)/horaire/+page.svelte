<script lang="ts" async>
    import { onDestroy, onMount } from "svelte";
    import dayjs from "dayjs";
    import mongoose from "mongoose";
    import type { User } from "$lib/Types";
    import horaire from "$lib/stores/horaire";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import type { Class } from "$lib/Types";
    import AddPeriodForm from "./addPeriodForm.svelte";

    // fetch the user schedule from the server
    async function addPeriod() {
        await horaire.add(period);
    }

    let period ={
            name: "Period 1",
            timeStart: dayjs().hour(14).minute(0),
            timeEnd: dayjs().hour(16).minute(0),
        }



    let schedule: Class[] = [];
    async function getPeriod() {
        schedule = await (await fetch("/api/schedule")).json();
    }

</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div class="flex justify-center">
    <div class="">
        <button
            type="button"
            class="mx-5 flex transform rounded-md bg-blue-600 px-4 py-3 text-white shadow-lg outline-none transition-transform focus:ring-4 active:scale-x-75"
            on:click={addPeriod}
        >
            <box-icon name="plus" />
            <span class="ml-2">Évènement</span>
        </button>

        <!-- <ScheduleView {schedule}/> -->
        <AddPeriodForm/>



        <!-- {#eachsche as period}
      <div>{period.name} - {period.timeStart.format('hh:mm A')} to {period.timeEnd.format('hh:mm A')}</div>
    {/each} -->
    </div>
</div>
