<script context="module" lang="ts">
    // Dropdown option type definition
    type DropdownOption = {
        text: string;
        color?: DropdownColor;
        href?: string;
        boxIcon?: string;
        onClick?: (
            event: Event & {
                currentTarget: EventTarget;
            }
        ) => any;
    };

    // Exported context for managing dropdown options and separator
    export type DropdownContext = { addOption: (a: DropdownOption) => void; separate: () => void };
    export type DropdownColor = "normal" | "red" | "blue" | "green";
</script>

<script lang="ts">
    import { setContext } from "svelte";
    import EmptyDropdown, { type DropdownPosition } from "./EmptyDropdown.svelte";
    import classNames from "classnames";

    // Exported position prop and internal actions state
    export let position: DropdownPosition = "side-right";
    export let fullWidth: boolean = false;
    export let actions: DropdownOption[][] = [];

    // Set the context for managing dropdown options and separators
    setContext<DropdownContext>("dropdown", {
        addOption: (action: DropdownOption) => {
            if (actions.length === 0) actions.push([]);
            actions.at(-1)?.push(action);
            actions = actions;
        },
        separate: () => (actions = [...actions, []]),
    });

    // Get color class for dropdown option based on color prop
    function getColor(action: DropdownOption) {
        switch (action.color) {
            case "red":
                return "text-red-600 dark:text-red-600";
            case "blue":
                return "text-blue-400 dark:text-blue-400";
            case "green":
                return "text-green-500 dark:text-green-500";
            default:
                return "text-neutral";
        }
    }
</script>

<!-- Main component, wraps EmptyDropdown and handles button and dropdown items -->
<EmptyDropdown bind:position bind:fullWidth>
    <!-- Button slot -->
    <div slot="button" class="w-full">
        {#if $$slots.button}
            <slot name="button" />
        {:else}
            <i class="bx bx-dots-vertical-rounded text-2xl" />
        {/if}
    </div>

    <!-- Render dropdown options -->
    {#each actions as section}
        <div class="flex flex-col py-2">
            {#each section as action}
                {#if action.href}
                    <a
                        data-sveltekit-preload-data={action.href === "/deconnexion" ? "off" : null}
                        class={`whitespace-nowrap px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 ${getColor(
                            action
                        )}`}
                        href={action.href}
                        data-closeOnClick
                    >
                        <div class="flex items-center">
                            {#if action.boxIcon}
                                <i class={`bx ${action.boxIcon} mr-5 text-2xl`} />
                            {/if}
                            {action.text}
                        </div>
                    </a>
                {:else}
                    <button
                        class={classNames(
                            "whitespace-nowrap px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600",
                            getColor(action)
                        )}
                        on:click={action.onClick}
                        type="button"
                        data-closeOnClick
                    >
                        <div class="flex items-center">
                            {#if action.boxIcon}
                                <i class={`bx ${action.boxIcon} mr-5 text-2xl`} />
                            {/if}
                            {action.text}
                        </div>
                    </button>
                {/if}
            {/each}
        </div>
    {/each}
</EmptyDropdown>

<!-- Hidden slot container for content rendered outside -->
<div class="hidden">
    <slot />
</div>
