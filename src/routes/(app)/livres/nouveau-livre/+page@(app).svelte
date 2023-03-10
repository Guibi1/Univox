<script lang="ts">
    let titreLivre = "";
    let nomAuteur = "";
    let etatLivre = "";
    let prix: string = "";

    function doSomething(titreLivre: any, nomAuteur: any, etatLivre: any, prix: any): any {
        throw new Error("Function not implemented.");
    }
</script>

<svelte:head>
    <title>Univox | Livres | Nouveau livre</title>
</svelte:head>

<div class="min-h-screen flex justify-evenly items-center bg-white dark:bg-neutral-900">
    <main class="bg-neutral-900 dark:bg-white p-12 rounded w-96 h-max">
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
            Nom de(s) (l')auteur(s)
            <input bind:value={nomAuteur} required />
        </label>

        <label>
            L'état du livre
            <input bind:value={etatLivre} required />
        </label>
        <label>
            Prix de vente
            <input bind:value={prix} required />
        </label>
    </div>

    <div class="flex flex-col items-stretch gap-5 pr-40 pt-20">
        <div
            class="box-border h-[250px] rounded-xl border-4 border-gray-600 bg-gray-600 bg-opacity-60"
        />

        <button
            class="hover:bg-blue-secondary active:bg-cyan-900 focus:ring focus:ring-gray-500"
            type="submit"
        >
            Créer l'annonce
        </button>
    </div>
</form>
