<script lang="ts">
    import { onMount } from "svelte";
    import "../style.css";
    import colorScheme from "$lib/stores/colorScheme";

    onMount(() => {
        // @ts-ignore
        import("boxicons");
        colorScheme.onMount();
    });
</script>

<slot />
