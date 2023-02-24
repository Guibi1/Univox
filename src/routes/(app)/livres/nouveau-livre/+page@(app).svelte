<script lang="ts">
    let titreLivre = "";
    let etatLivre = "";
    let prix: string = "";

    function doSomething(titreLivre: any, etatLivre: any): any {
        throw new Error("Function not implemented.");
    }
</script>

<svelte:head>
    <title> Univox | Livres | Nouveau livre </title>
</svelte:head>

<div class="min-h-screen flex justify-evenly items-center bg-stone-200">
    <main class="bg-white p-12 rounded w-96 h-max">
        <form
            on:submit={() => doSomething(titreLivre, etatLivre)}
            class="flex flex-col justify-between gap-6"
        >
            <h1 class="text-center">Vendre un livre</h1>

            <label>
                Nom du livre
                <input bind:value={titreLivre} required />
            </label>

            <label>
                L'état du livre
                <input bind:value={etatLivre} required />
            </label>
            <label>
                Prix de vente
                <input bind:value={prix} required />
            </label>

            <button type="submit">Créer l'annonce</button>
        </form>
    </main>
</div>
