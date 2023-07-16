<script lang="ts">
    import { Autocomplete, InputChip, type AutocompleteOption } from "@skeletonlabs/skeleton";

    export let codes: string[];
    export let selectedCodes: string[];
    export let onChange: Function;

    let userInput = "";

    function onSelection({ detail }: CustomEvent<AutocompleteOption>) {
        selectedCodes.push(detail.label);
        selectedCodes = selectedCodes;
        onChange();
    }
</script>

<div class="flex flex-col gap-2">
    <h4 class="h4 mb-2">Filtrer par cours</h4>

    <InputChip
        bind:input={userInput}
        bind:value={selectedCodes}
        on:add={() => onChange()}
        on:remove={() => onChange()}
        whitelist={codes}
        name="codes"
        allowUpperCase
        placeholder="Code du cours"
    />

    <div class="card max-h-48 w-full max-w-sm overflow-y-auto p-4" tabindex="-1">
        <Autocomplete
            bind:input={userInput}
            options={codes.map((c) => ({ value: c, label: c }))}
            denylist={selectedCodes}
            on:selection={onSelection}
            emptyState={codes.length === 0
                ? "Aucun cours disponible pour le moment"
                : "Aucun cours correspond à votre recherche"}
        />
    </div>
</div>
