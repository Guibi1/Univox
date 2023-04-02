<script lang="ts">
    import user from "$lib/stores/user";
    import { adventurer } from "@dicebear/collection";
    import { createAvatar } from "@dicebear/core";

    export let seed = "";
    $: avatar = createAvatar(adventurer, { seed: seed || $user.avatar }).toDataUriSync();
</script>

<img src={avatar} class="aspect-square h-full" alt="avatar" />
