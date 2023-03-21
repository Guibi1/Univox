<script lang="ts">
    export let codes: string[];
    export let onchange: (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => any;

    let options: string[] = ["matière 1", "matière 2", "AAAAAAAAAAAAAAAAAaa", "A"];
</script>

<ul class="w-fit border-4 p-2">
    {#each options as code}
        <li>
            <label class=" flex flex-row items-center gap-2">
                <input type="checkbox" bind:group={codes} value={code} on:change={onchange} />
                {code}
            </label>
        </li>
    {/each}
</ul>
