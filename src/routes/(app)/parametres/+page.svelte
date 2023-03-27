<script lang="ts">
    import firstDayOfTheWeek, { type FirstDayOfTheWeek } from "$lib/stores/firstDayOfTheWeek";

    function setDate(event: Event & { currentTarget: HTMLSelectElement }) {
        firstDayOfTheWeek.set(event.currentTarget.value as FirstDayOfTheWeek);
    }
</script>

<h1 class="text-center">PARAMÈTRES</h1>

<div>
    Jour de commencement de la semaine
    <select
        on:change={(value) => {
            setDate(value);
        }}
        bind:value={$firstDayOfTheWeek}
    >
        <option value="Samedi">Samedi</option>
        <option value="Dimanche">Dimanche</option>
        <option value="Lundi">Lundi</option>
    </select>
</div>
