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

    function clique(action: Action)
    {
        action.onClick(); /* Ça marche, mais pas content */
        toggle();
    }

    function toggle() {
        open = !open;
    }

    function closeOnClickOutside(node: HTMLElement, enabled: boolean) {
        const handleOutsideClick = ({ target }: Event) => {
            if (!node.contains(target as Node)) {
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
    <button
        on:click={toggle}
        class="flex self-start p-2 text-sm font-medium text-center hover:gray-100"
        type="button"
    >
        <box-icon name="dots-vertical-rounded" class="w-6 hover:text-black-600" />
    </button>

    <!-- Dropdown menu -->
    <div
        class="absolute z-10 bg-gray-200 divide-y divide-gray-100 rounded dark:bg-neutral-700 dark:divide-neutral-300"
        hidden={!open}
    >
        {#each actions as section}
            <div class="flex flex-col py-2">
                {#each section as action}
                    <button
                        class={`px-4 py-2 text-left hover:bg-neutral-300 dark:hover:bg-neutral-600 ${getColor(
                            action
                        )}`}
                        on:click={() => clique(action)}>{action.title}</button
                    >
                {/each}
            </div>
        {/each}
        
    </div>
</div>
