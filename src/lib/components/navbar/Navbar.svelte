<script lang="ts">
    import { page } from "$app/stores";
    import Avatar from "$lib/components/Avatar.svelte";
    import notifications from "$lib/stores/notifications";
    import LogoText from "$src/assets/logo-text.svelte";
    import { AppBar, popup } from "@skeletonlabs/skeleton";
    import classNames from "classnames";
    import AvatarPopup from "./AvatarPopup.svelte";
    import NotificationsPopup from "./NotificationsPopup.svelte";

    const pages = [
        { text: "Accueil", href: "/" },
        { text: "Livres", href: "/livres" },
        { text: "Horaire", href: "/horaire" },
        { text: "Amis", href: "/amis" },
    ];
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
    <a slot="lead" href="/">
        <LogoText height="2rem" />
    </a>

    <ul class="relative hidden h-full flex-row items-center justify-between md:flex">
        {#each pages as page}
            <li class="relative h-full">
                <a
                    href={page.href}
                    class="btn-sm px-4 text-lg transition hover:text-primary-500-400-token"
                >
                    {page.text}
                </a>
            </li>
        {/each}
    </ul>

    <div slot="trail" class="flex gap-4">
        <button
            class="btn-icon variant-glass-surface"
            use:popup={{ event: "click", target: "notifications", placement: "bottom-end" }}
        >
            <i
                class={classNames(
                    "bx text-2xl text-white",
                    $notifications.length === 0 ? "bx-bell" : "bxs-bell-ring"
                )}
            />
        </button>

        <button
            class="btn-icon variant-ghost-primary"
            use:popup={{
                event: "click",
                target: "avatar",
                placement: "bottom-end",
                closeQuery: ".listbox-item",
            }}
        >
            <Avatar />
        </button>
    </div>
</AppBar>

<NotificationsPopup />
<AvatarPopup />
