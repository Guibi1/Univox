<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import WeekSelector from "$lib/components/WeekSelector.svelte";
    import schedule from "$lib/stores/schedule";
    import dayjs from "dayjs";
    import NewPeriodForm from "./NewPeriodForm.svelte";

    let currentWeek = dayjs();
</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div
    class="flex flex-col items-center gap-4 border-b border-black bg-white p-4 dark:border-neutral-500 dark:bg-neutral-900"
>
    <h1>Mon Horaire</h1>
</div>

<div class="grid grid-cols-[1fr_3fr_1fr] gap-10 p-6 px-10">
    <div>
        <h2 class="mb-4 border-b border-black dark:border-white">Ajouter un évènement</h2>

        <NewPeriodForm />
    </div>

    <div class="flex flex-col items-center gap-4">
        <WeekSelector {currentWeek} />

        <ScheduleView {currentWeek} schedule={$schedule} />
    </div>

    <div>
        <a href="/horaire/importer" class="filled">Importer d'Omnivox</a>
    </div>
</div>
