<script lang="ts">
    import { Autocomplete, InputChip, type AutocompleteOption } from "@skeletonlabs/skeleton";

    export let codes: string[];
    export let selectedCodes: string[];

    let userInput = "";
    $: options = codes
        .filter((c) => !selectedCodes.includes(c))
        .map((c) => ({ value: c, label: c }));

    function onSelection({ detail }: CustomEvent<AutocompleteOption>) {
        selectedCodes.push(detail.value as string);
        selectedCodes = selectedCodes;
    }
</script>

<div class="label">
    <span>Filtrer par cours</span>

    <InputChip
        bind:input={userInput}
        bind:value={selectedCodes}
        name="codes"
        validation={(value) => codes.includes(value)}
        allowUpperCase
        placeholder="Code du cours"
    />

    <div class="card max-h-48 w-full overflow-y-auto p-4" tabindex="-1">
        <Autocomplete
            bind:input={userInput}
            {options}
            on:selection={onSelection}
            emptyState={codes.length === 0
                ? "Aucun cours disponible pour le moment"
                : "Aucun cours ne correspond à votre recherche"}
        />
    </div>
</div>
