<script lang="ts">
    import user from "$lib/stores/user";
    let fname = "";
    let lname = "";
    let email = "";
    let password = "";
</script>

<form on:submit={() => user.login(email, password)} class="flex flex-col gap-6">
    <h1 class="text-center">Inscription</h1>

    <div class="grid grid-cols-2 gap-4">
        <label>
            Prénom
            <input bind:value={fname} type="text" required />
        </label>

        <label>
            Nom
            <input bind:value={lname} type="text" required />
        </label>

        <label class="col-span-2">
            Courriel
            <input bind:value={email} type="email" required />
        </label>

        <label class="col-span-2">
            Mot de passe
            <input bind:value={password} type="password" required />
        </label>
    </div>

    <div class="flex flex-col">
        <button type="submit">S'inscrire</button>

        <span class="text-center">ou</span>

        <a href="/connexion" class="self-center">Se connecter</a>
    </div>
</form>
