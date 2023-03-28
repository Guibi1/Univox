<script lang="ts">
    import { page } from "$app/stores";

    const data = {
        vendre: {
            href: "mes-livres",
            iconName: "bx-book-open",
            text: "Mes livres",
        },
        acheter: {
            href: "achat",
            iconName: "bx-book-heart",
            text: "Acheter",
        },
    };

    let current: keyof typeof data;
    $: current = $page.url.pathname.endsWith("/achat") ? "vendre" : "acheter";
</script>

<slot />

<a
    href={data[current].href}
    class="fixed right-8 bottom-8 flex w-48 items-center gap-0.5 rounded-full bg-blue-primary p-2 px-4 text-2xl !text-black"
>
    <i class={`${data[current].iconName} bx text-3xl`} />
    <span class="flex-1 text-center">
        {data[current].text}
    </span>
</a>

<a
    href="vendre"
    class="fixed left-8 bottom-8 flex items-center gap-0.5 rounded-full bg-blue-primary p-2 px-4 text-2xl !text-black"
>
    <i class="bx bx-book-add text-3xl" />
</a>
