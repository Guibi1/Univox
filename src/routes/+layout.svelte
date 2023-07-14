<script lang="ts">
    import { page } from "$app/stores";
    import "$assets/boxicons/boxicons.css";
    import colorScheme from "$lib/stores/colorScheme";
    import "@skeletonlabs/skeleton/themes/theme-gold-nouveau.css";
    import "@skeletonlabs/skeleton/styles/skeleton.css";
    import dayjs from "dayjs";
    import fr from "dayjs/locale/fr-ca";
    import weekday from "dayjs/plugin/weekday";
    import "../style.css";

    dayjs.extend(weekday);
    dayjs.locale(fr);

    colorScheme.setInitial($page.data.storesInitialValue.colorScheme);
</script>

<slot />
