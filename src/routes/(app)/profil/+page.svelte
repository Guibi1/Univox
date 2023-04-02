<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
    import user from "$lib/stores/user";

    const refresh = () => user.setAvatar(Math.random() + $user.firstName + $user.da);
</script>

<h1>Profil</h1>

<div class="h-28">
    <Avatar />
</div>

<button class="filled gap-2" on:click={refresh}>
    <i class="bx bx-dice-6 text-2xl" />
    Avatar au hasard
</button>
