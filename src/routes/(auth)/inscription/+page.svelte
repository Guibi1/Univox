<form method="post" action="/api/register" class="flex flex-col gap-6">
    <h1 class="text-center">Inscription</h1>

    <div class="grid grid-cols-2 gap-4">
        <label>
            Prénom
            <input name="fname" type="text" required />
        </label>

        <label>
            Nom
            <input name="lname" type="text" required />
        </label>

        <label class="col-span-2">
            No de DA
            <input name="da" type="text" required />
        </label>

        <label class="col-span-2">
            Courriel
            <input name="email" type="email" required />
        </label>

        <label class="col-span-2">
            Mot de passe
            <input name="password" type="password" required />
        </label>
    </div>

    <div class="flex flex-col">
        <button type="submit">S'inscrire</button>

        <span class="text-center">ou</span>

        <a href="/connexion" class="self-center">Se connecter</a>
    </div>
</form>
