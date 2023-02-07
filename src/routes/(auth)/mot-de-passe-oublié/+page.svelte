<script lang="ts">
    let omnivox = true;
    let loading = false;
    let errorText = "";
    let da = "";
    let password = "";

    async function handleSubmit(e: SubmitEvent) {
        if (!omnivox) return;

        e.preventDefault();
        if (da.length === 0 || password.length === 0) return;

        loading = true;
        const res = await fetch("/api/omnivox/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ da, password }),
        });

        loading = false;
        if (res.status === 200) {
            omnivox = false;
        } else {
            errorText = "DA ou mot de passe invalide";
        }
    }
</script>

<form
    on:submit={handleSubmit}
    method="post"
    action="/api/reset-password"
    class="flex flex-col justify-between gap-6"
>
    <h1 class="text-center">Mot de passe oublié</h1>

    {#if errorText}
        <span class="text-center text-red-600">{errorText}</span>
    {/if}

    <label hidden={!omnivox || loading}>
        No de DA
        <input bind:value={da} name="da" type="text" required />
    </label>

    <label hidden={!omnivox || loading}>
        Mot de passe Omnivox
        <input bind:value={password} name="password" type="password" required />
    </label>

    <label hidden={omnivox || loading}>
        Nouveau mot de passe
        <input name="newPassword" type="password" required={!omnivox} />
    </label>

    {#if loading}
        <box-icon name="loader-circle" animation="spin" class="self-center" />
    {/if}

    <a href="/connexion" class="flex self-start">
        <box-icon name="chevron-left" class="fill-cyan-300" />
        Retour
    </a>

    <button type="submit">Suivant</button>
</form>
