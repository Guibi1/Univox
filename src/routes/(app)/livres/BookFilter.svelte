<script lang="ts">
    export let codes: string[];
    export let selectedCodes: string[];
    export let onChange: Function;
</script>

<div>
    <h3>Filtrer par cours</h3>

    <ul class="p-2">
        {#each codes as code}
            <li>
                <label class=" flex flex-row items-center gap-2">
                    <input
                        type="checkbox"
                        bind:group={selectedCodes}
                        value={code}
                        on:change={() => onChange()}
                    />
                    {code}
                </label>
            </li>
        {/each}
    </ul>
</div>
