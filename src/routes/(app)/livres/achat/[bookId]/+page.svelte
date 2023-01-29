<script lang="ts">
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";

    let bookId = "";

    onDestroy(page.subscribe((page) => (bookId = page.params.bookId)));
</script>

<div>{bookId}</div>
