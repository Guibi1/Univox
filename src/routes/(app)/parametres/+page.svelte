<script lang="ts">
    import firstDayOfTheWeek from "$lib/stores/firstDayOfTheWeek";
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";
</script>

<h1 class="text-center">Paramètres</h1>

<ColorSchemeSwitch />

<label>
    Jour de commencement de la semaine
    <select bind:value={$firstDayOfTheWeek}>
        <option value="Samedi">Samedi</option>
        <option value="Dimanche">Dimanche</option>
        <option value="Lundi">Lundi</option>
    </select>
</label>

<!--Pour donner un sens de sécurité aux utilisateurs-->
<a href="/">Sauvgarder et quitter</a>
