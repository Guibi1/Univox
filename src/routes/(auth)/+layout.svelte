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
        class="bg-glass relative w-full overflow-hidden transition-[height] max-tablet:!h-full tablet:w-[32rem] tablet:rounded-2xl"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="flex h-full w-full flex-col items-stretch gap-2 px-4 py-12 tablet:absolute tablet:h-auto tablet:px-10"
        >
            <slot />
        </main>

        <div class="absolute right-4 bottom-4 z-10">
            <ColorSchemeSwitch />
        </div>
    </div>
</div>
