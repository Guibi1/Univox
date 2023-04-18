<script lang="ts">
    import { weekdayOffset } from "$lib/stores/firstDayOfTheWeek";
    import dayjs from "dayjs";

    export let currentWeek = dayjs();

    // Fonction de déplacement d'une semaine en arrière ou en avant
    const moveWeek = (weeks: number) => (currentWeek = currentWeek.add(weeks, "weeks"));
</script>

<!-- Affiche la semaine en cours avec le jour de début et de fin -->
<div class="flex items-center justify-center gap-6">
    <button class="filled gap-2" on:click={() => moveWeek(-1)}>
        <i class="bx bxs-left-arrow" />
        Précédente
    </button>

    <span>
        Semaine du {currentWeek.weekday($weekdayOffset).format("D")} au {currentWeek
            .weekday(6 + $weekdayOffset)
            .format("D MMMM YYYY")}
    </span>

    <button class="filled gap-2" on:click={() => moveWeek(1)}>
        Suivante
        <i class="bx bxs-right-arrow" />
    </button>
</div>
