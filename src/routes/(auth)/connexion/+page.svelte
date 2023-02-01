<script lang="ts">
    import user from "$lib/stores/user";
    let email = "";
    let password = "";
</script>

<form on:submit={() => user.login(email, password)} class="flex flex-col justify-between gap-6">
    <h1 class="text-center">Connexion</h1>

    <label>
        Courriel
        <input bind:value={email} type="email" required />
    </label>

    <label>
        Mot de passe
        <input bind:value={password} type="password" required />
    </label>

    <div class="flex justify-between">
        <a href="/inscription">S'inscrire</a>
        <a href="/mot-de-passe-oublié">Mot de passe oublié ?</a>
    </div>

    <button type="submit">Se connecter</button>
</form>
