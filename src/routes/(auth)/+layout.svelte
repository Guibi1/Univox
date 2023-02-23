<script lang="ts">
    import colorScheme, { colorSchemeIsDark } from "$lib/stores/colorScheme";
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;
</script>

<WavesBackground />

<div class="h-screen flex justify-center items-center">
    <div
        class="relative w-[32rem] overflow-hidden rounded bg-stone-200 dark:bg-neutral-900 !bg-opacity-80 backdrop-blur-xl transition-[height]"
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
            class="absolute right-2 bottom-2 z-10 rounded-lg p-1 h-8 aspect-square border-2 border-zinc-400 hover:border-zinc-300 bg-transparent hover:bg-zinc-500 dark:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
        >
            <box-icon name={$colorSchemeIsDark ? "moon" : "sun"} class="w-full h-full" />
        </button>
    </div>
</div>
