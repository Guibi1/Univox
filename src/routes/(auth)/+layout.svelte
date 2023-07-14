<script lang="ts">
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;
</script>

<WavesBackground />

<div class="flex h-screen items-center justify-center">
    <div
        class="bg-glass max-md:!h-full md:w-[32rem] md:rounded-2xl relative w-full overflow-hidden transition-[height]"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="md:absolute md:h-auto md:px-10 flex h-full w-full flex-col items-stretch gap-2 px-4 py-12"
        >
            <slot />
        </main>

        <div class="absolute bottom-4 right-4 z-10">
            <ColorSchemeSwitch />
        </div>
    </div>
</div>
