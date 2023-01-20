<script lang="ts">
	let num: number = 0;

	const plus = (x: number) => {
		num += x;
	};
</script>

<h1 class="text-6xl">Univox</h1>
<button class="border-2 border-blue-600" on:click={() => plus(3)}>
	yeyyy {num}
</button>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
