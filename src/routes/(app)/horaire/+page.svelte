<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import schedule from "$lib/stores/schedule";
    import NewPeriodForm from "./NewPeriodForm.svelte";
</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div class="flex flex-col items-center">
    <div class="">
        <NewPeriodForm />
    </div>

    <ScheduleView schedule={$schedule} />
</div>
