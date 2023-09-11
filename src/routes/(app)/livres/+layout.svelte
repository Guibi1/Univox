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

<a href="/livres/vendre" class="variant-filled-primary btn fixed bottom-8 left-8">
    <i class="bx bx-book-add text-2xl" />
    <span> Vendre </span>
</a>

<slot />

<a href={data[current].href} class="variant-filled-primary btn fixed bottom-8 right-8">
    <i class={classNames("bx text-2xl", data[current].iconName)} />
    <span>
        {data[current].text}
    </span>
</a>
