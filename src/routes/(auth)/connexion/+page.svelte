<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<form class="flex flex-col justify-between gap-6" method="post" use:enhance>
    <h1 class="text-center">Connexion</h1>

    <span hidden={form == null} class="text-center text-red-500">
        {#if form?.missing}
            Veuillez remplir tous les champs
        {:else if form?.incorrect}
            Le DA et le mot de passe ne correspondent pas
        {/if}
    </span>

    <div class="grid grid-rows-2 gap-4">
        <label>
            No de DA
            <input name="da" type="text" value={form?.da ?? ""} />
        </label>

        <label>
            Mot de passe
            <input name="password" type="password" />
        </label>
    </div>

    <div class="flex justify-between">
        <a href="/inscription">S'inscrire</a>
        <a href="/mot-de-passe-oublié">Mot de passe oublié ?</a>
    </div>

    <button type="submit">Se connecter</button>
</form>
