<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import Navbar from "./Navbar.svelte";

    onMount(() => {
        const bc = new BroadcastChannel("Invalidate user");
        bc.postMessage("");
        bc.addEventListener("message", () => invalidate("app:user"));
        return () => bc.close();
    });
</script>

<div class="grid h-[100vh] grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="overflow-y-auto">
        <slot />
    </div>
</div>
