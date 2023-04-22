<script lang="ts">
    import colorScheme from "$lib/stores/colorScheme";
    import classNames from "classnames";
</script>

<button
    aria-label="thème du site"
    on:click={colorScheme.toggle}
    class="aspect-square h-8 rounded-lg border-2 !bg-transparent p-1 transition duration-300 ease-in"
>
    <i class={classNames("bx text-white", $colorScheme === "dark" ? "bx-sun" : "bx-moon")} />
</button>
