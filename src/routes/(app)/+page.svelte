<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import schedule from "$lib/stores/schedule";
</script>

<svelte:head>
    <title>Univox</title>
</svelte:head>

<ScheduleView schedule={$schedule} />
