<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
</script>

<button
    aria-label="thème du site"
    on:click={colorScheme.toggle}
    class="aspect-square h-8 rounded-lg border-2 border-blue-primary !bg-transparent p-1 dark:border-blue-primary"
>
    <box-icon
        name={$colorScheme === "dark" ? "sun" : "moon"}
        class="h-full w-full fill-blue-primary dark:fill-blue-primary"
    />
</button>

