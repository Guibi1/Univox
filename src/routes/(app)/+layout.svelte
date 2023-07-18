<script lang="ts">
    import { page } from "$app/stores";
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";

    user.set($page.data.stores.user);
    notifications.set($page.data.stores.notifications);
    schedule.set($page.data.stores.schedule);
    friends.set($page.data.stores.friends);
    groups.set($page.data.stores.groups);
</script>

<div class="grid h-screen grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="flex flex-col overflow-y-auto">
        <slot />
    </div>
</div>
