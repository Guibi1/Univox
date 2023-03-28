<script lang="ts">
    import { page } from "$app/stores";

    const data = {
        vendre: {
            href: "mes-livres",
            iconName: "book-open",
            text: "Mes livres",
        },
        acheter: {
            href: "achat",
            iconName: "book-heart",
            text: "Acheter",
        },
    };

    let current: keyof typeof data;
    $: current = $page.url.pathname.endsWith("/achat") ? "vendre" : "acheter";
</script>

<slot />

<a
    href={data[current].href}
    class="fixed right-8 bottom-8 flex w-48 items-center gap-0.5 rounded-full bg-blue-300 !fill-black p-2 px-4 text-2xl !text-black"
>
    <box-icon name={data[current].iconName} class="h-8 w-8 fill-black" />
    <span class="flex-1 text-center">
        {data[current].text}
    </span>
</a>

<a
    href="vendre"
    class="fixed left-8 bottom-8 flex items-center gap-0.5 rounded-full bg-cyan-300 p-2 px-4 text-2xl text-black"
>
    <box-icon name="book-add" class="h-8 w-8 fill-black" />
</a>
