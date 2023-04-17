<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import schedule from "$lib/stores/schedule";
    import AddPeriodForm from "./AddPeriodForm.svelte";
</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div class="flex justify-center">
    <div class="">
        <button type="button" class="filled">
            <box-icon name="plus" />
            <span class="ml-2">Évènement</span>
        </button>

        <AddPeriodForm />
    </div>
</div>

<ScheduleView schedule={$schedule.classes} />
