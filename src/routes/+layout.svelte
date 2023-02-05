<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
    import { onMount } from "svelte";
    import "../style.css";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
    colorScheme.setInitial(data.colorScheme);

    onMount(() => {
        // @ts-ignore
        import("boxicons");
    });
</script>

<slot />
