<script lang="ts">
    export let bookId: string | null;
</script>

{#if bookId}
    <div>
        {bookId}
    </div>
{/if}
