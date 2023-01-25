<script lang="ts">
	import { user } from '../../stores';
	let username = '';
	let password = '';
</script>

<main class="h-screen flex justify-evenly items-center bg-stone-200">
	<div class="flex flex-col gap-4">
		<p class="h-28 w-28 bg-cyan-100">LOGO</p>
		<h1 class="font-bold">Univox</h1>
	</div>

	<form
		on:submit={() => user.login(username, password)}
		class="flex flex-col justify-between w-96 h-max gap-6 bg-white p-12 rounded"
	>
		<h2>Connexion</h2>

		<label class="flex flex-col gap w-full">
			Nom d'utilisateur
			<input value={username} type="text" class="h-10" />
		</label>

		<label class="flex flex-col gap w-full">
			Mot de passe
			<input value={password} type="password" class="h-10" />
		</label>

		<button class="self-end text-cyan-300 cursor-pointer">Mot de passe oublié?</button>

		<button type="submit" class="h-10 rounded bg-cyan-300">Se connecter</button>
	</form>
</main>
