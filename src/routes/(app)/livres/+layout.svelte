<script lang="ts">
    import { page } from "$app/stores";
    import classNames from "classnames";

    const data = {
        vendre: {
            href: "/livres/mes-livres",
            iconName: "bx-book-open",
            text: "Mes livres",
        },
        acheter: {
            href: "/livres",
            iconName: "bx-book-heart",
            text: "Acheter",
        },
    };

    let current: keyof typeof data;
    $: current = $page.url.pathname.endsWith("/livres") ? "vendre" : "acheter";
</script>

<a
    href="/livres/vendre"
    class="fixed bottom-8 left-8 flex items-center gap-0.5 rounded-full bg-blue-primary p-2 px-4 text-2xl !text-black"
>
    <i class="bx bx-book-add text-3xl" />
</a>

<slot />

<a
    href={data[current].href}
    class="fixed bottom-8 right-8 flex w-48 items-center gap-0.5 rounded-full bg-blue-primary p-2 px-4 text-2xl !text-black"
>
    <i class={classNames("bx text-3xl", data[current].iconName)} />
    <span class="flex-1 text-center">
        {data[current].text}
    </span>
</a>
