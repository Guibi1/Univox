<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import user from "$lib/stores/user";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let loading = false;

    const handleSubmit = (() => {
        loading = true;
        return async ({ result, update }) => {
            if (result.type === "redirect") {
                user.refresh();
            }
            loading = false;
            update();
        };
    }) satisfies SubmitFunction;
</script>

<h1 class="text-center">Connexion</h1>

{#if loading}
    <box-icon name="loader-circle" animation="spin" class="h-10 my-6 flex items-center w-full" />
{/if}

<form use:enhance={handleSubmit} hidden={loading} class="flex flex-col gap-6" method="post">
    <div class="grid grid-rows-2 gap-4">
        <label>
            No de DA
            <input
                name="da"
                type="text"
                pattern={"\\d{7}"}
                required
                placeholder=" "
                value={form?.da ?? ""}
            />
        </label>

        <label data-error={form?.incorrect}>
            Mot de passe
            <input
                name="password"
                type="password"
                pattern={".{8,}"}
                required
                placeholder=" "
                on:input={() => form && (form.incorrect = false)}
            />
            {#if form?.incorrect}
                <span>Mot de passe erroné</span>
            {/if}
        </label>
    </div>

    <div class="flex justify-between">
        <a href="/inscription">S'inscrire</a>
        <a href="/mot-de-passe-oublié">Mot de passe oublié ?</a>
    </div>

    <button type="submit">Se connecter</button>
</form>
