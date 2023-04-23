<script context="module" lang="ts">
    // Dermines the position of the dropdown menu
    export type DropdownPosition = "side-right" | "bottom-left" | "bottom-right";
</script>

<script lang="ts">
    import classNames from "classnames";

    export let position: DropdownPosition;
    export let fullWidth: boolean = false;

    // State for dropdown open/close
    let open = false;

    // Function to handle closing the dropdown when clicking outside
    function closeOnClickOutside(node: HTMLElement, enabled: boolean) {
        // Event listener function for clicks outside the dropdown
        const handleOutsideClick = ({ target }: Event) => {
            if (!node.contains(target as HTMLElement)) {
                open = false;
            } else if (node.contains(target as HTMLElement)) {
                let element = target as HTMLElement;
                while (element.parentElement !== node) {
                    if (element.hasAttribute("data-closeOnClick")) {
                        open = false;
                        break;
                    }

                    if (element.parentElement === null) break;
                    element = element.parentElement;
                }
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
                    "w-full": fullWidth,
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
