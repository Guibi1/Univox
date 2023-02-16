<script lang="ts">
    let hovering: boolean;
</script>

<div on:mouseenter={() => (hovering = true)} on:mouseleave={() => (hovering = false)}>
    <slot {hovering} />
</div>
