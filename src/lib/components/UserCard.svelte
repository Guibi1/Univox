<script lang="ts">
    import type { User } from "lucia-auth";
    import Avatar from "./Avatar.svelte";

    export let user: User;
</script>

<div class="flex justify-items-start gap-2 h-12">
    <Avatar seed={user.avatar} />

    <div class="flex flex-col justify-around items-start">
        <span>
            {user.firstName}
            {user.lastName}
        </span>

        <small class="opacity-50">{user.email}</small>
    </div>
</div>
