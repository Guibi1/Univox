<script lang="ts">
    import Calendar from "$lib/components/Calendar.svelte";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import schedule from "$lib/stores/schedule";
    import dayjs from "dayjs";
    import NewPeriodForm from "./NewPeriodForm.svelte";

    export let data;

    let selectedDay = dayjs();
</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div class="grid grid-cols-[1fr_3fr_1fr] gap-10 overflow-hidden p-6">
    <div class="inline-flex max-h-full flex-1 flex-col gap-6">
        <Calendar bind:selectedDay />

        <a href="/horaire/importer" class="btn variant-outline-primary">Importer d'Omnivox</a>
    </div>

    <ScheduleView bind:startDay={selectedDay} schedule={$schedule} periodsCanBeDeleted />

    <div>
        <h4 class="h4 mb-4 border-b border-black dark:border-white">Ajouter un évènement</h4>

        <NewPeriodForm {data} />
    </div>
</div>
