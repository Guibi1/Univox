<script lang="ts">
    import Navbar from "$lib/components/navbar/Navbar.svelte";
    import friends from "$lib/stores/friends";
    import groups from "$lib/stores/groups";
    import notifications from "$lib/stores/notifications";
    import schedule from "$lib/stores/schedule";
    import user from "$lib/stores/user";

    export let data;

    user.set(data.stores.user);
    notifications.set(data.stores.notifications);
    schedule.set(data.stores.schedule);
    friends.set(data.stores.friends);
    groups.set(data.stores.groups);
</script>

<div class="grid h-screen grid-rows-[min-content_1fr] overflow-hidden">
    <Navbar />

    <div class="flex flex-col overflow-y-auto">
        <slot />
    </div>
</div>
