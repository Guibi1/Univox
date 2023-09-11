<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import LogoText from "$src/assets/logo-text.svelte";
    import Logo from "$src/assets/logo.svelte";
    import { onDestroy, onMount } from "svelte";

    let timer: NodeJS.Timeout;
    onMount(() => (timer = setInterval(() => invalidateAll(), 5000)));
    onDestroy(() => clearInterval(timer));
</script>

<div class="flex h-[100vh] items-center justify-center">
    <main class="grid grid-rows-2">
        <div class="flex flex-col items-center gap-4">
            <Logo size="6rem" />
            <hr class="w-48" />
            <LogoText width="10rem" />
        </div>

        <h1 class="mt-10 text-center">Vous êtes hors ligne</h1>
    </main>
</div>
