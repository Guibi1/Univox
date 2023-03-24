<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import Page from "../+page.svelte";
    import { onMount } from "svelte";
    
    onMount(async () => {
        fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
                return [];
            });
    });
</script>

<svelte:head>
    <title>Univox | Horaire</title>
</svelte:head>

<div class="flex justify-center">
    <!-- <Page /> -->
    <div class="">
        <button
            type="button"
            class="px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex"
        >
            <box-icon name="plus" />
            <span class="ml-2">Évènement</span>
        </button>
    </div>
</div>
<div>
    <h1>Whiskey Drinks Menu</h1>
	<ul>
	{#each $drinkNames as drinkName}
		<li>{drinkName}</li>
	{/each}
	</ul>
</div>
