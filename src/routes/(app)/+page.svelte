<script lang="ts">
    import user from "$lib/stores/user";
</script>

{#if $user}
    {$user.firstName}
    YEY
{/if}
