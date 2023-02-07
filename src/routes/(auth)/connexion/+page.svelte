<form method="post" action="/api/login" class="flex flex-col justify-between gap-6">
    <h1 class="text-center">Connexion</h1>

    <label>
        No de DA
        <input name="da" type="text" required />
    </label>

    <label>
        Mot de passe
        <input name="password" type="password" required />
    </label>

    <div class="flex justify-between">
        <a href="/inscription">S'inscrire</a>
        <a href="/mot-de-passe-oublié">Mot de passe oublié ?</a>
    </div>

    <button type="submit">Se connecter</button>
</form>
