<script lang="ts">
    export let query = "";
    export let handleSearch: (query: string) => void;
    export let reactiveSearch = false;
    export let placeholder = "Rechercher...";

    let timeout: NodeJS.Timeout | null;
    function timedSearch() {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => handleSearch(query), 300);
    }
</script>

<div class="input-group h-12 grid-cols-[auto_1fr]">
    <div class="grid">
        <i class="bx bx-search-alt text-2xl" />
    </div>

    <input
        type="search"
        {placeholder}
        class="text-lg"
        bind:value={query}
        on:input={reactiveSearch ? timedSearch : null}
        on:keypress={(e) => {
            if (e.key == "Enter") {
                if (timeout) clearTimeout(timeout);
                handleSearch(query);
            }
        }}
    />
</div>
