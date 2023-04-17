<script lang="ts">
    import { getContext } from "svelte";
    import type { DropdownColor, DropdownContext } from "./Dropdown.svelte";
    import type { SelectContext } from "./Select.svelte";

    export let text: string;
    export let value: string | undefined = undefined;
    export let separate = false;
    export let href: string | undefined = undefined;
    export let color: DropdownColor = "normal";
    export let onClick:
        | undefined
        | ((
              event: Event & {
                  currentTarget: EventTarget;
              }
          ) => any) = undefined;

    const dropdown: undefined | DropdownContext = getContext("dropdown");
    if (dropdown) {
        if (separate) dropdown.separate();
        dropdown.addOption({ text, href, color, onClick });
    } else {
        const select: undefined | SelectContext = getContext("select");
        if (select) select.addOption({ text, value });
    }
</script>
