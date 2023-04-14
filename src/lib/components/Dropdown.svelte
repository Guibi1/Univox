<script context="module" lang="ts">
    type DropdownOption = {
        text: string;
        color?: DropdownColor;
        href?: string;
        selected?: boolean;
        onClick?: (
            event: Event & {
                currentTarget: EventTarget;
            }
        ) => any;
    };

    export type DropdownContext = { addOption: (a: DropdownOption) => void; separate: () => void };
    export type DropdownColor = "normal" | "red" | "blue";
</script>

<script lang="ts">
    import { set } from "mongoose";

    import { setContext } from "svelte";
    import EmptyDropdown, { type DropdownPosition } from "./EmptyDropdown.svelte";

    export let position: DropdownPosition = "side-right";
    export let actions: DropdownOption[][] = [];

    setContext<DropdownContext>("dropdown", {
        addOption: (action: DropdownOption) => {
            if (actions.length === 0) actions.push([]);
            actions.at(-1)?.push(action);
            actions = actions;
        },
        separate: () => (actions = [...actions, []]),
    });

    function getColor(action: DropdownOption) {
        switch (action.color) {
            case "red":
                return "text-red-400 dark:text-red-400";
            case "blue":
                return "text-blue-400 dark:text-blue-400";
            default:
                return "text-neutral";
        }
    }
</script>

<EmptyDropdown bind:position>
    <div slot="button" class="w-full">
        {#if $$slots.button}
            <slot name="button" />
        {:else}
            <i class="bx bx-dots-vertical-rounded text-2xl" />
        {/if}
    </div>

    {#each actions as section}
        <div class="flex flex-col py-2">
            {#each section as action}
                {#if action.href}
                    <a
                        class={`whitespace-nowrap px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 ${getColor(
                            action
                        )}`}
                        href={action.href}
                        data-closeOnClick
                    >
                        {action.text}
                    </a>
                {:else}
                    <button
                        class={`whitespace-nowrap px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 ${getColor(
                            action
                        )}`}
                        on:click={action.onClick}
                        data-closeOnClick
                    >
                        {action.text}
                    </button>
                {/if}
            {/each}
        </div>
    {/each}
</EmptyDropdown>

<div class="hidden">
    <slot />
</div>
