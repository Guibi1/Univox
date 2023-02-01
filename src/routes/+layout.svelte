<script lang="ts">
    import { onMount } from "svelte";
    import "../style.css";

    onMount(() => {
        // @ts-ignore
        import("boxicons");
    });
</script>

<slot />
