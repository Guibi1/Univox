<script lang="ts">
    import logo from "$assets/logo.webp";
</script>

<div class="min-h-screen flex justify-evenly items-center bg-stone-200">
    <div class="flex flex-col gap-4 items-center">
        <img src={logo} alt="Univox's logo" />
        <h1 class="font-bold text-4xl items-center ">Univox</h1>
    </div>

    <main class="bg-white p-6 px-10 rounded w-96 h-max">
        <slot />
    </main>
</div>
