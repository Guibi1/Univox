<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
    import friends from "$lib/stores/friends";
    import startWeekDate from "$lib/stores/startWeekDate";
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
    colorScheme.setInitial(data.storesInitialValue.colorScheme);
    startWeekDate.setInitial(data.storesInitialValue.startWeekDate);
    user.set(JSON.parse(data.storesInitialValue.serializedUser));
    friends.set(JSON.parse(data.storesInitialValue.serializedFriends));

    onMount(() => {
        // @ts-ignore
        import("boxicons");
    });
</script>

<slot />
