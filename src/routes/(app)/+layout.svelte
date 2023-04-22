<script lang="ts">
    import { invalidate } from "$app/navigation";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import Navbar from "./Navbar.svelte";

    export let data: LayoutData;
    user.set(data.storesInitialValue.user);
    schedule.set(data.storesInitialValue.schedule);
    friends.set(data.storesInitialValue.friends);
    groups.set(data.storesInitialValue.groups);
    notifications.set(data.storesInitialValue.notifications);

    onMount(() => {
        const bc = new BroadcastChannel("Invalidate user");
        bc.postMessage("");
        bc.addEventListener("message", () => invalidate("app:user"));
        return () => bc.close();
    });
</script>

<div class="grid h-screen grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="flex flex-col overflow-y-auto">
        <slot />
    </div>
</div>
