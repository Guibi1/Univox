<script lang="ts">
    import colorScheme, { colorSchemeIsDark } from "$lib/stores/colorScheme";
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;
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

        <button
            on:click={colorScheme.toggle}
            class="absolute right-2 bottom-2 z-10 rounded-lg p-1 h-8 aspect-square !bg-transparent border-2 border-blue-500 dark:border-blue-primary"
        >
            <box-icon
                name={$colorSchemeIsDark ? "sun" : "moon"}
                class="w-full h-full fill-gray-600 dark:fill-blue-primary"
            />
        </button>
    </div>
</div>
