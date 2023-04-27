<script lang="ts">
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";
    import type { LayoutData } from "./$types";
    import Navbar from "./Navbar.svelte";

    export let data: LayoutData;
    user.set(data.storesInitialValue.user);
    schedule.set(data.storesInitialValue.schedule);
    friends.set(data.storesInitialValue.friends);
    groups.set(data.storesInitialValue.groups);
    notifications.set(data.storesInitialValue.notifications);
</script>

<div class="grid h-screen grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="flex flex-col overflow-y-auto">
        <slot />
    </div>
</div>
