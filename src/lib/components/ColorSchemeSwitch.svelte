<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
</script>

<button
    aria-label="thème du site"
    on:click={colorScheme.toggle}
    class="rounded-lg p-1 h-8 aspect-square !bg-transparent border-2 border-blue-primary dark:border-blue-primary"
>
    <box-icon
        name={$colorScheme === "dark" ? "sun" : "moon"}
        class="w-full h-full fill-blue-primary dark:fill-blue-primary"
    />
</button>
