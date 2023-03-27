<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
    import startWeekDate from "$lib/stores/firstDayOfTheWeek";
    import dayjs from "dayjs";
    import fr from "dayjs/locale/fr-ca";
    import weekday from "dayjs/plugin/weekday";
    import { onMount } from "svelte";
    import "../style.css";
    import type { LayoutData } from "./$types";

    dayjs.extend(weekday);
    dayjs.locale(fr);

    export let data: LayoutData;
    colorScheme.setInitial(data.storesInitialValue.colorScheme);
    startWeekDate.setInitial(data.storesInitialValue.startWeekDate);

    onMount(() => {
        // @ts-ignore
        import("boxicons");
    });
</script>

<slot />
