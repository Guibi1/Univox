<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
    import user from "$lib/stores/user";
    import { onMount } from "svelte";
    import "../style.css";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
    colorScheme.setInitial(data.storesInitialValue.colorScheme);
    user.set(JSON.parse(data.storesInitialValue.serializedUser));

    onMount(() => {
        // @ts-ignore
        import("boxicons");
    });
</script>

<slot />
