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

    let images: string[] = [];  // TODO maximum images has to be 5
    let currentImageIndex = 0;
    $: currentImage = images[currentImageIndex];

    function dropFiles(node: HTMLElement, onDrop: (e: DragEvent) => any) {
        const dragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        };
        node.addEventListener("dragover", dragOver);
        node.addEventListener("drop", onDrop);

        return {
            destroy: () => {
                node.removeEventListener("dragover", dragOver);
                node.removeEventListener("drop", onDrop);
            },
        };
    }

    function handleUpload(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        if (!e.currentTarget.files) return;
        readImages(e.currentTarget.files);
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        if (!e.dataTransfer) return;
        readImages(e.dataTransfer.files);
    }

    function readImages(files: FileList) {
        for (let file of files) {
            if (file.type !== "image/png" && file.type !== "image/jpeg") return;
            let reader = new FileReader();
            reader.addEventListener("loadend", (e) => {
                let newImage = e.target?.result as string;
                if (!images.includes(newImage)) images = [...images, newImage];
            });
            reader.readAsDataURL(file);
        }
    }

</script>

<svelte:head>
    <title>Univox | Livres | Nouveau livre</title>
</svelte:head>

<h1 class="text-center">Vendre un livre</h1>

<form
    use:enhance={handleSubmit}
    class="m-auto grid max-w-5xl grid-cols-[2fr_2fr] gap-6"
    method="post"
>
    <div class="flex flex-col items-stretch gap-5">
        <label data-error={form?.missing}>
            Nom du livre
            <input name="title" type="text" required placeholder=" " />
        </label>

        <label>
            Nom de(s) l'auteur(s)
            <input name="author" type="text" required placeholder=" " />
        </label>

        <label>
            L'état du livre
            <select name="state" required>
                <option>Neuf</option>
                <option>Usagé - Comme neuf</option>
                <option>Usagé - Bon état</option>
                <option>Usagé - Endommagé</option>
            </select>
        </label>

        <label>
            Prix de vente
            <input name="price" type="text" maxlength="3" required placeholder=" " />
        </label>
        
        <label>
            ISBN
            <input name="isbn" type="text" placeholder=" " />
        </label>
    </div>
    
    <div class="flex flex-col items-stretch gap-5">
        <div class="grid h-[20rem] flex-col rounded-xl">
            <label use:dropFiles={handleDrop} class="cursor-pointer bg-neutral-500 flex items-center justify-center h-[15rem]">
                <input type="file" multiple class="hidden" accept="image/png, image/jpeg" on:change={handleUpload}/>
                <!--TODO make the image fit the gray rectangle, whatever the initial resolution is-->
                <img alt="" class="object-cover" src={currentImage}/>
                {#if !currentImage}
                    <box-icon class="absolute" name="plus" size="3rem"/>
                {/if}
            </label>
            <div class="grid grid-cols-5 h-[5rem]">
                {#each images as image} 
                    <!--TODO make the selected image have the green (or other color) border-->
                    <img src={image} class="object-cover h-[5rem] w-[5rem] hover:h-[6rem] hover:w-[6rem] hover:-translate-x-[0.5rem] border-2 border-blue-primary" alt=""/>
                {/each}
            </div>

        </div>

        <button
            class="hover:bg-blue-secondary focus:ring focus:ring-gray-500 active:bg-cyan-900    "
            type="submit"
        >
            Créer l'annonce
        </button>
    </div>
</form>
