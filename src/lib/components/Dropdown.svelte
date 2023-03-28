<script lang="ts">
    export let position: "side-right" | "bottom-left" | "bottom-right" = "side-right";
    export let actions: Action[][];

    type Action = {
        title: string;
        color?: "normal" | "red" | "blue";
        href?: string;
        onClick?: (
            event: Event & {
                currentTarget: EventTarget;
            }
        ) => any | null;
    };

    let open = false;

    function getColor(action: Action) {
        switch (action.color) {
            case "red":
                return "text-red-400 dark:text-red-400";
            case "blue":
                return "text-blue-400 dark:text-blue-400";
            default:
                return "text-neutral";
        }
    }

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
    <button on:click={() => (open = !open)} class="hover:gray-100 flex items-center justify-center">
        {#if $$slots.default}
            <slot />
        {:else}
            <i class="bx bx-dots-vertical-rounded text-2xl" />
        {/if}
    </button>

    <!-- Dropdown menu -->
    {#if open}
        <div
            class={`absolute z-[200] min-w-[13ch] divide-y divide-gray-100 rounded bg-gray-200 dark:divide-neutral-300 dark:bg-neutral-700 ${
                position == "bottom-right"
                    ? "top-full left-0"
                    : position == "bottom-left"
                    ? "top-full right-0"
                    : "left-full"
            }`}
        >
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
                                {action.title}
                            </a>
                        {:else}
                            <button
                                class={`whitespace-nowrap px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 ${getColor(
                                    action
                                )}`}
                                on:click={action.onClick}
                                data-closeOnClick
                            >
                                {action.title}
                            </button>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
