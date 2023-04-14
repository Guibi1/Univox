<script lang="ts">
    import "$assets/boxicons/boxicons.css";
    import colorScheme from "$lib/stores/colorScheme";
    import firstDayOfTheWeek from "$lib/stores/firstDayOfTheWeek";
    import dayjs from "dayjs";
    import fr from "dayjs/locale/fr-ca";
    import weekday from "dayjs/plugin/weekday";
    import "../style.css";
    import type { LayoutData } from "./$types";

    dayjs.extend(weekday);
    dayjs.locale(fr);

    export let data: LayoutData;
    colorScheme.setInitial(data.storesInitialValue.colorScheme);
    firstDayOfTheWeek.setInitial(data.storesInitialValue.firstDayOfTheWeek);
</script>

<slot />
