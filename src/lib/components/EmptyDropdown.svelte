<script context="module" lang="ts">
    // Exported DropdownPosition type to determine the position of the dropdown menu
    export type DropdownPosition = "side-right" | "bottom-left" | "bottom-right";
</script>

<script lang="ts">
    import classNames from "classnames";

    // Exported variable for dropdown position
    export let position: DropdownPosition;

    // State for dropdown open/close
    let open = false;

    // Function to handle closing the dropdown when clicking outside
    function closeOnClickOutside(node: HTMLElement, enabled: boolean) {
        // Event listener function for clicks outside the dropdown
        const handleOutsideClick = ({ target }: Event) => {
            if (
                !node.contains(target as HTMLElement) ||
                (target as HTMLElement).hasAttribute("data-closeOnClick")
            ) {
                open = false;
            }
        };

        // Function to update enabled state and add or remove event listener
        const update = (enabled: boolean) => {
            if (enabled) window.addEventListener("click", handleOutsideClick);
            else window.removeEventListener("click", handleOutsideClick);
        };

        update(enabled);
        return {
            update,
            destroy: () => window.removeEventListener("click", handleOutsideClick),
        };
    }
</script>

<!-- Main container with closeOnClickOutside custom action -->
<div use:closeOnClickOutside={open} class="relative grid">
    <!-- Toggle button for dropdown menu -->
    <button
        on:click={() => (open = !open)}
        type="button"
        class="hover:gray-100 flex items-center justify-center"
    >
        <slot name="button" />
    </button>

    <!-- Dropdown menu -->
    {#if open}
        <div
            class={classNames(
                "absolute z-[200] overflow-hidden rounded-lg bg-gray-200 dark:bg-neutral-700",
                {
                    "left-0 top-full": position == "bottom-right",
                    "right-0 top-full": position == "bottom-left",
                    "left-full": position == "side-right",
                }
            )}
        >
            <!-- Slot container for dropdown items -->
            <div
                class="flex min-w-[13ch] flex-col divide-y divide-gray-100 dark:divide-neutral-300"
            >
                <slot />
            </div>
        </div>
    {/if}
</div>
