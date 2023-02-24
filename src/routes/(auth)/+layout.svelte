<<<<<<< Updated upstream
<div class="min-h-screen flex justify-center items-center bg-stone-200">
    <main class="py-8 px-10 w-[32rem] h-max rounded flex flex-col gap-2 items-stretch bg-white dark:bg-neutral-800">
        <slot />
    </main>
=======
<script lang="ts">
    import colorScheme, { colorSchemeIsDark } from "$lib/stores/colorScheme";
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;
</script>

<WavesBackground />

<div class="h-screen flex justify-center items-center">
    <div
        class="relative w-[32rem] overflow-hidden rounded bg-neutral-50 dark:bg-neutral-900 !bg-opacity-80 backdrop-blur-xl transition-[height]"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="absolute w-full py-8 px-10 flex flex-col gap-2 items-stretch"
        >
            <slot />
        </main>

        <button
            on:click={colorScheme.toggle}
            class="absolute right-2 bottom-2 z-10 rounded-lg p-1 h-8 aspect-square !bg-transparent border-2 border-blue-500 dark:border-blue-300"
        >
            <box-icon
                name={$colorSchemeIsDark ? "moon" : "sun"}
                class="w-full h-full fill-blue-500 dark:fill-blue-300"
            />
        </button>
    </div>
>>>>>>> Stashed changes
</div>
