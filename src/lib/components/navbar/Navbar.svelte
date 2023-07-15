<script lang="ts">
    import { page } from "$app/stores";
    import Avatar from "$lib/components/Avatar.svelte";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import EmptyDropdown from "$lib/components/EmptyDropdown.svelte";
    import Option from "$lib/components/Option.svelte";
    import friends from "$lib/stores/friends";
    import notifications from "$lib/stores/notifications";
    import LogoText from "$src/assets/logo-text.svelte";
    import classNames from "classnames";
    import { AppBar, popup } from "@skeletonlabs/skeleton";
    import Logo from "$src/assets/logo.svelte";
    import NotificationsPopup from "./NotificationsPopup.svelte";
    import AvatarPopup from "./AvatarPopup.svelte";

    const pages = [
        { text: "Accueil", href: "/" },
        { text: "Livres", href: "/livres" },
        { text: "Horaire", href: "/horaire" },
        { text: "Amis", href: "/amis" },
    ];

    $: currentPage = pages.reduce(
        (prev, { href }, i) => ($page.url.pathname.startsWith(href) ? i : prev),
        0
    );
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
    <a slot="lead" href="/" class="fill-token">
        <LogoText height="2rem" />
    </a>

    <ul class="relative hidden h-full flex-row items-center justify-between md:flex">
        {#each pages as page, i}
            <li class="relative h-full">
                <a
                    href={page.href}
                    class="flex h-full items-center px-8 text-center text-xl text-white transition-[color] duration-300 ease-in-out dark:text-white dark:hover:text-blue-primary"
                >
                    {page.text}

                    {#if currentPage === i}
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2">
                            <hr
                                class="w-20 border-2 !border-blue-primary transition duration-300 ease-in-out"
                            />
                        </span>
                    {/if}
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
