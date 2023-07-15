<script lang="ts">
    import { page } from "$app/stores";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";
    import Navbar from "../../lib/components/navbar/Navbar.svelte";

    user.set($page.data.storesInitialValue.user);
    schedule.set($page.data.storesInitialValue.schedule);
    friends.set($page.data.storesInitialValue.friends);
    groups.set($page.data.storesInitialValue.groups);
    notifications.set($page.data.storesInitialValue.notifications);
</script>

<div class="grid h-screen grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="flex flex-col overflow-y-auto">
        <slot />
    </div>
</div>
