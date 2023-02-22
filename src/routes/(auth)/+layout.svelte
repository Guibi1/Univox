<script lang="ts">
    let height: number | null;
</script>

<div class="min-h-screen flex justify-center items-center bg-stone-200">
    <div
        class="relative w-[32rem] overflow-hidden rounded bg-white dark:bg-neutral-800 transition-[height]"
        style="height: {height}px;"
    >
        <main
            bind:clientHeight={height}
            class="absolute py-8 px-10 w-[32rem] flex flex-col gap-2 items-stretch"
        >
            <slot />
        </main>
    </div>
</div>
