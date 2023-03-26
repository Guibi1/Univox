<script lang="ts">
    export let query = "";
    export let handleSearch: (query: string) => void;

    let timeout: NodeJS.Timeout | null;
    function timedSearch() {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => handleSearch(query), 500);
    }
</script>

<input
    type="text"
    bind:value={query}
    on:input={timedSearch}
    on:keypress={(e) => {
        if (e.key == "Enter") {
            if (timeout) clearTimeout(timeout);
            handleSearch(query);
        }
    }}
    placeholder="Rechercher"
    class="h-12 w-full rounded-lg text-lg"
/>
