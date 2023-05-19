<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let expanded = false;

    function toggleExpand() {
        expanded = !expanded;
        dispatch("toggle", expanded);
    }
</script>

<button on:click={toggleExpand}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="h-5 w-5 !fill-none"
    >
        {#if expanded}
            <!-- Upward arrow icon -->
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
            />
        {:else}
            <!-- Downward arrow icon -->
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            />
        {/if}
    </svg>
</button>
