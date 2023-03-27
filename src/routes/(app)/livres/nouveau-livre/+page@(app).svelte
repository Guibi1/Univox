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

    const maxImagesCount = 4;
    let images: string[] = [];
    let selectedIndex = 0;

    function removeImage(index: number) {
        images.splice(index, 1);
        images = images; // This is to tell the compiler to update so that the preview images element updates
        selectedIndex =
            !images[selectedIndex] && selectedIndex > 0 ? selectedIndex - 1 : selectedIndex;
    }

    function dropFiles(node: HTMLElement, onDrop: (e: DragEvent) => any) {
        const dragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer && images.length < maxImagesCount) {
                e.dataTransfer.effectAllowed = "move";
            }
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
            if (images.length >= maxImagesCount) return;
            let reader = new FileReader();
            reader.addEventListener("loadend", (e) => {
                if (images.length >= maxImagesCount) return;
                let newImage = e.target?.result as string;
                if (!images.includes(newImage) && images.length < 5) {
                    images = [...images, newImage];
                }
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
        <div class="relative grid h-[20rem] flex-col rounded-xl">
            <div use:dropFiles={handleDrop} class="flex h-[15rem] bg-neutral-500">
                {#if images.length === 0}
                    <label class="flex cursor-pointer items-center justify-center">
                        <box-icon class="absolute" name="plus" size="3rem" />
                        <input
                            type="file"
                            multiple
                            class="hidden"
                            accept="image/png, image/jpeg"
                            on:change={handleUpload}
                        />
                    </label>
                {:else}
                    <img
                        src={images[selectedIndex]}
                        alt="Livre"
                        class="h-full w-full object-cover"
                    />
                    <button
                        class="absolute top-0 right-0 fill-red-500"
                        on:click={() => removeImage(selectedIndex)}
                    >
                        <box-icon name="trash" size="3rem" />
                    </button>
                {/if}
            </div>

            <div class="flex items-center justify-start gap-2">
                {#each images as image, i}
                    <button on:click={() => (selectedIndex = i)}>
                        <img
                            src={image}
                            class={`aspect-square w-20 cursor-pointer border-2 object-cover hover:scale-110 ${
                                selectedIndex === i ? "border-blue-primary" : "border-neutral-300"
                            }`}
                            alt=""
                        />
                    </button>
                {/each}

                {#if images.length < maxImagesCount}
                    <label
                        class="flex aspect-square w-20 cursor-pointer items-center justify-center border-2 border-neutral-300 bg-neutral-500 object-cover hover:scale-110"
                    >
                        <box-icon class="absolute" name="plus" size="3rem" />
                        <input
                            type="file"
                            multiple
                            class="hidden"
                            accept="image/png, image/jpeg"
                            on:change={handleUpload}
                        />
                    </label>
                {/if}
            </div>
        </div>

        <button class="filled" type="submit"> Créer l'annonce </button>
    </div>
</form>
