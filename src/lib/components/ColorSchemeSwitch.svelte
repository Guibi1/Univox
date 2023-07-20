<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
</script>

<button
    aria-label="thème du site"
    on:click={colorScheme.toggle}
    class="btn-icon btn-icon-sm border-surface-900-50-token rounded-md border-token"
>
    <i class={`bx ${$colorScheme === "dark" ? "bx-sun" : "bx-moon"}`} />
</button>
