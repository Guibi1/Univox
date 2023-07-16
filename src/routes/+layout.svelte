<script lang="ts">
    import { page } from "$app/stores";
    import "$assets/boxicons/boxicons.css";
    import colorScheme from "$lib/stores/colorScheme";
    import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
    import { Modal, Toast, storePopup } from "@skeletonlabs/skeleton";
    import "@skeletonlabs/skeleton/themes/theme-gold-nouveau.css";

    import "../style.css";
    import "@skeletonlabs/skeleton/styles/skeleton.css";

    import dayjs from "dayjs";
    import fr from "dayjs/locale/fr-ca";
    import weekday from "dayjs/plugin/weekday";
    dayjs.extend(weekday);
    dayjs.locale(fr);

    colorScheme.setInitial($page.data.storesInitialValue.colorScheme);
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Modal />
<Toast />

<slot />
