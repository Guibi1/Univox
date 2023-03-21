<script lang="ts">
    import { invalidate } from "$app/navigation";
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";
    import { onMount } from "svelte";
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;

    onMount(() => {
        const bc = new BroadcastChannel("Invalidate user");
        bc.postMessage("");
        bc.addEventListener("message", () => invalidate("app:user"));
        return () => bc.close();
    });
</script>

<WavesBackground />

<div class="flex h-screen items-center justify-center">
    <div
        class="bg-glass relative w-[32rem] overflow-hidden rounded-2xl transition-[height]"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="absolute flex w-full flex-col items-stretch gap-2 py-12 px-10"
        >
            <slot />
        </main>

        <div class="absolute right-4 bottom-4 z-10">
            <ColorSchemeSwitch />
        </div>
    </div>
</div>
