<script lang="ts">
    type ActionColor = "normal" | "red" | "blue";
    type Action = {
        title: string;
        color?: ActionColor;
        onClick: (
            event: Event & {
                currentTarget: EventTarget;
            }
        ) => any;
    };
    export let actions: Action[][] = [];

    let open = false;

    function getColor(action: Action) {
        switch (action.color) {
            case "red":
                return "text-red-400";
            case "blue":
                return "text-blue-400";
            default:
                return "text-neutral";
        }
    }

    function toggle() {
        open = !open;
    }

    function closeOnClickOutside(node: HTMLElement, enabled: boolean) {
        const handleOutsideClick = ({ target }: Event) => {
            if (!node.contains(target as Node) || (target as Node).nodeName === "BUTTON") {
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

<div use:closeOnClickOutside={open}>
    <button on:click={toggle} class="hover:gray-100 flex p-2" type="button">
        {#if $$slots.default}
            <slot />
        {:else}
            <i class="bx bx-dots-vertical-rounded text-2xl" />
        {/if}
    </button>

    <!-- Dropdown menu -->
    <div
        class="absolute z-10 divide-y divide-gray-100 rounded bg-gray-200 dark:divide-neutral-300 dark:bg-neutral-700"
        hidden={!open}
    >
        {#each actions as section}
            <div class="flex flex-col py-2">
                {#each section as action}
                    <button
                        class={`px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 ${getColor(
                            action
                        )}`}
                        on:click={action.onClick}
                    >
                        {action.title}
                    </button>
                {/each}
            </div>
        {/each}
    </div>
</div>
