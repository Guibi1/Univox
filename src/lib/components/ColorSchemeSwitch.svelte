<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
</script>

<button
    aria-label="thème du site"
    on:click={colorScheme.toggle}
    class="aspect-square h-8 rounded-lg border-2 border-black !bg-transparent p-1 dark:border-white hover:dark:border-black hover:border-white transition ease-in duration-300"
>
    <box-icon
        name={$colorScheme === "dark" ? "sun" : "moon"}
        class="h-full w-full fill-black dark:fill-white hover:dark:fill-black hover:fill-white transition ease-in duration-300"
    />
</button>
