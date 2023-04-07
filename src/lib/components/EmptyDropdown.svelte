<script context="module" lang="ts">
    export type DropdownPosition = "side-right" | "bottom-left" | "bottom-right";
</script>

<script lang="ts">
    export let position: DropdownPosition;

    let open = false;

    function closeOnClickOutside(node: HTMLElement, enabled: boolean) {
        const handleOutsideClick = ({ target }: Event) => {
            if (
                !node.contains(target as HTMLElement) ||
                (target as HTMLElement).hasAttribute("data-closeOnClick")
            ) {
                open = false;
            }
        };

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

<div use:closeOnClickOutside={open} class="relative grid">
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
            class={`absolute z-[200] flex w-fit min-w-[13ch] flex-col divide-y divide-gray-100 rounded-lg bg-gray-200 dark:divide-neutral-300 dark:bg-neutral-700 
                ${
                    position == "bottom-right"
                        ? "left-0 top-full"
                        : position == "bottom-left"
                        ? "right-0 top-full"
                        : "left-full"
                }`}
        >
            <slot />
        </div>
    {/if}
</div>
