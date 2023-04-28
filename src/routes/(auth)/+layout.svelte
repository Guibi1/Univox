<script lang="ts">
    import ColorSchemeSwitch from "$lib/components/ColorSchemeSwitch.svelte";
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;
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

        <div class="absolute bottom-4 right-4 z-10">
            <ColorSchemeSwitch />
        </div>
    </div>
</div>
