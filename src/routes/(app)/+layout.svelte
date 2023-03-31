<script lang="ts">
    import { invalidate } from "$app/navigation";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import user from "$lib/stores/user";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import Navbar from "./Navbar.svelte";

    export let data: LayoutData;
    user.set(JSON.parse(data.storesInitialValue.serializedUser));
    friends.set(JSON.parse(data.storesInitialValue.serializedFriends));
    groups.set(JSON.parse(data.storesInitialValue.serializedGroups));

    onMount(() => {
        const bc = new BroadcastChannel("Invalidate user");
        bc.postMessage("");
        bc.addEventListener("message", () => invalidate("app:user"));
        return () => bc.close();
    });
</script>

<div class="grid h-[100vh] grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="overflow-y-auto">
        <slot />
    </div>
</div>
