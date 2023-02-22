<script lang="ts">
    import WavesBackground from "./WavesBackground.svelte";

    let height: number | null;
</script>

<WavesBackground />

<div class="h-screen flex justify-center items-center">
    <div
        class="relative w-[32rem] overflow-hidden rounded bg-white dark:bg-neutral-800 !bg-opacity-[85%] backdrop-blur transition-[height]"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="absolute w-full py-8 px-10 flex flex-col gap-2 items-stretch"
        >
            <slot />
        </main>
    </div>
</div>
