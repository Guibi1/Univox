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

<div class="h-screen flex justify-center items-center">
    <div
        class="relative w-[32rem] overflow-hidden rounded bg-stone-200 dark:bg-neutral-900 !bg-opacity-60 backdrop-blur-xl transition-[height]"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="absolute w-full py-12 px-10 flex flex-col gap-2 items-stretch"
        >
            <slot />
        </main>

        <div class="absolute right-4 bottom-4 z-10">
            <ColorSchemeSwitch />
        </div>
    </div>
</div>
