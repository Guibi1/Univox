<script context="module" lang="ts">
    type SelectOption = {
        value?: string;
        text: string;
    };

    export type SelectContext = { addOption: (o: SelectOption) => void };
</script>

<script lang="ts">
    import { createEventDispatcher, setContext } from "svelte";
    import Dropdown from "./Dropdown.svelte";
    import Option from "./Option.svelte";

    export let value: string = "";
    export let name: string = "";

    const dispatch = createEventDispatcher();
    let options: SelectOption[] = [];

    setContext<SelectContext>("select", {
        addOption: (option: SelectOption) => (options = [...options, option]),
    });
</script>

<Dropdown position="bottom-right">
    <div
        slot="button"
        class="flex h-12 w-full items-center justify-between rounded-lg border-2 border-neutral-600 bg-gray-200 px-4 outline-none focus-visible:border-black dark:bg-neutral-700 dark:text-white dark:focus-visible:border-white"
    >
        <span class="text-xl">
            {options.find((o) => o.value === value)?.text ?? (value || "Choisir une option")}
        </span>
        <i class="bx bx-chevron-down aspect-square text-xl text-white" />
    </div>

    {#each options as option}
        <Option
            text={option.text}
            onClick={() => {
                value = option.value ?? option.text;
                dispatch("change", value);
            }}
        />
    {/each}
</Dropdown>

<select hidden bind:value {name}>
    {#each options as option}
        <option value={option.value ?? option.text}>{option.text}</option>
    {/each}

    <slot />
</select>
