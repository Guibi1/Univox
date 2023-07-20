<script lang="ts">
    import Logo from "$src/assets/logo.svelte";

    export let size: string = "6rem";
</script>

<Logo {size}>
    <animateTransform
        slot="ring"
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="2s"
        repeatCount="indefinite"
        from="0 50 50"
        to="360 50 50"
    />
</Logo>
