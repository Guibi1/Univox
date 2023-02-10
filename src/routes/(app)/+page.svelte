<script lang="ts">
    import user from "$lib/stores/user";

    $: console.log($user);
</script>

{#if $user}
    {$user.firstName}
    YEY
{/if}
