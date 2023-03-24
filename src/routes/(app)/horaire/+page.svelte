<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import Page from "../+page.svelte";
    import { onMount } from "svelte";
</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div class="flex justify-center">
    <Page />
    <div class="">
        <button
            type="button"
            class="mx-5 flex transform rounded-md bg-blue-600 px-4 py-3 text-white shadow-lg outline-none transition-transform focus:ring-4 active:scale-x-75"
        >
            <box-icon name="plus" />
            <span class="ml-2">Évènement</span>
        </button>
    </div>
</div>
