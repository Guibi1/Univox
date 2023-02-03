<script lang="ts">
    import { colorSchemeIsDark } from "$lib/stores/colorScheme";
</script>

<h1 class="text-6xl">Univox</h1>

<label class="flex items-center">
    <input type="checkbox" bind:checked={$colorSchemeIsDark} />
    Dark mode
</label>
