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

<form
    on:submit={() => doSomething(titreLivre, nomAuteur, etatLivre, prix)}
    class="grid grid-cols-[1fr_2fr] gap-6"
>
    <div class="flex flex-col items-stretch gap-5">
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
    <div class="pt-20">
        <div
            class="box-border h-2/3 border-4 radius-10 border-gray-600 bg-gray-600 bg-opacity-60"
        />
        <button class="w-2/3" type="submit">Créer l'annonce</button>
    </div>
</form>
