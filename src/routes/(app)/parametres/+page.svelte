<script lang="ts">
    import firstDayOfTheWeek from "$lib/stores/firstDayOfTheWeek";
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";
    import Select from "$lib/components/Select.svelte";
    import Option from "$lib/components/Option.svelte";
</script>

<h1 class="text-center">Paramètres</h1>

<ColorSchemeSwitch />

<div>
    Jour de commencement de la semaine
    <Select bind:value={$firstDayOfTheWeek}>
        <Option text="Lundi" />
        <Option text="Samedi" />
        <Option text="Dimanche" />
    </Select>
</div>
