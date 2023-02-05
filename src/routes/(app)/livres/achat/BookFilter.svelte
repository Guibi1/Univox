<script lang="ts">
    export let filters: string[];

    let selectedFilters: string[] = [];
</script>

<ul class="border-4 w-fit p-2">
    {#each filters as filter}
        <li>
            <label class=" flex flex-row items-center gap-2">
                <input type="checkbox" bind:group={selectedFilters} value={filter} />
                {filter}
            </label>
        </li>
    {/each}
</ul>
