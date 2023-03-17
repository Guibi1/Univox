<script lang="ts">
    import startWeekDate, { type StartWeekDate } from "$lib/stores/startWeekDate";

    function setDate(event: Event & { currentTarget: HTMLSelectElement }) {
        startWeekDate.set(event.currentTarget.value as StartWeekDate);
    }
</script>

<h1 class="text-center">PARAMÈTRES</h1>

<div>
    Jour de commencement de la semaine
    <select
        on:change={(value) => {
            setDate(value);
        }}
    >
        <option value="Samedi">Samedi</option>
        <option value="Dimanche">Dimanche</option>
        <option value="Lundi">Lundi</option>
    </select>
</div>
