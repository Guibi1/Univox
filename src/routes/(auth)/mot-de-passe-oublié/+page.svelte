<script lang="ts">
	import user from '@stores/user';
	let email = '';
</script>

<form class="flex flex-col justify-between gap-6">
	<h1 class="text-center">Mot de passe oublié</h1>

	<label>
		Courriel
		<input bind:value={email} type="email" class="h-10" />
	</label>

	<a href="/connexion" class="flex self-start">
		<box-icon name="chevron-left" class="fill-cyan-300" />
		Retour
	</a>

	<button type="submit">Suivant</button>
</form>
