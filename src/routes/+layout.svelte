<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
    import user from "$lib/stores/user";
    import dayjs from "dayjs";
    import fr from "dayjs/locale/fr-ca";
    import weekday from "dayjs/plugin/weekday";
    import { onMount } from "svelte";
    import "../style.css";
    import type { LayoutData } from "./$types";

    dayjs.extend(weekday);
    dayjs.locale(fr);

    export let data: LayoutData;
    colorScheme.setInitial(data.colorScheme);
    user.set(JSON.parse(data.currentUser));

    onMount(() => {
        // @ts-ignore
        import("boxicons");
    });
</script>

<slot />
