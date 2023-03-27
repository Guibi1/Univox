<script lang="ts">
    export const maxImagesCount = 4;
    export let images: string[] = [];
    export let selectedIndex = 0;
    export let readOnly = false;

    let isDragginOver = false;

    function removeImage(index: number) {
        images.splice(index, 1);
        images = images; // This is to tell the compiler to update so that the preview images element updates
        selectedIndex =
            !images[selectedIndex] && selectedIndex > 0 ? selectedIndex - 1 : selectedIndex;
    }

    function handleUpload(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        if (!e.currentTarget.files) return;
        readImages(e.currentTarget.files);
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        if (!e.dataTransfer) return;
        readImages(e.dataTransfer.files);
        isDragginOver = false;
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

    function dropFiles(node: HTMLElement, enabled: boolean) {
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        };

        const setActive = (enable: boolean) => {
            if (enable) {
                node.addEventListener("dragover", handleDragOver);
                node.addEventListener("drop", handleDrop);
            } else {
                node.removeEventListener("dragover", handleDragOver);
                node.removeEventListener("drop", handleDrop);
            }
        };

        setActive(enabled);
        return {
            update: (enabled: boolean) => setActive(enabled),
            destroy: () => setActive(false),
        };
    }
</script>

<div class="relative py-4">
    <div
        use:dropFiles={images.length < maxImagesCount && !readOnly}
        on:dragenter={() => {isDragginOver = true}}
        on:dragleave={() => {isDragginOver = false}}
        
        class={`relative flex h-64 items-stretch transition ease-in-out duration-300 ${isDragginOver ? "bg-blue-secondary":"bg-neutral-700"}`}
    >
        {#if images.length === 0}
            <label class="flex cursor-pointer flex-col items-center justify-center break-normal whitespace-nowrap">
                <box-icon name="cloud-upload" class={`pointer-events-none transition ease-in-out duration-300 ${isDragginOver?"opacity-50":"opacity-100"}`} size="4rem" />
                <p class={`pointer-events-none ease-in-out duration-300 ${isDragginOver?"opacity-50":"opacity-100"}`}>Glissez ici des images de votre livre</p>
                

                <input
                    type="file"
                    multiple
                    class="hidden"
                    accept="image/png, image/jpeg"
                    on:change={handleUpload}
                />
            </label>
        {:else}
            <img src={images[selectedIndex]} alt="Livre" class={`pointer-events-none h-full w-full object-cover`} />
            <div class={`flex w-full h-full absolute z-10 bg-blue-secondary flex-col items-center justify-center break-normal whitespace-nowrap transition ease-in-out duration-300 ${isDragginOver ? "opacity-100":"opacity-0"}`}>
                <box-icon name="cloud-upload" class={`pointer-events-none transition ease-in-out duration-300 ${isDragginOver?"opacity-50":"opacity-100"}`} size="4rem" />
                <p class={`pointer-events-none ease-in-out duration-300 ${isDragginOver?"opacity-20":"opacity-100"}`}>Glissez ici des images de votre livre</p>
            </div>


            {#if !readOnly}
                <button
                    type="button"
                    on:click={() => removeImage(selectedIndex)}
                    class="absolute top-2 right-2 fill-red-500"
                >
                    <box-icon name="trash" size="2rem" />
                </button>
            {/if}
        {/if}
    </div>

    <div class="relative h-10">
        <div class="z-20 absolute -top-8 flex w-full items-center justify-center gap-2">
            {#each images as image, i}
                <button type="button" on:click={() => (selectedIndex = i)}>
                    <img
                        src={image}
                        class={`aspect-square w-20 cursor-pointer border-2 object-cover transition ease-in-out duration-100 hover:scale-110 ${
                            selectedIndex === i ? "border-blue-primary" : "border-neutral-300"
                        }`}
                        alt=""
                    />
                </button>
            {/each}

            <!--TODO the problem with having the images half in the big rectangle is the drag and drop animaiton can bug if you leave by this square-->
            {#if images.length < maxImagesCount && !readOnly}
                <label
                    class="z-20 flex aspect-square w-20 cursor-pointer items-center justify-center border-2 border-neutral-300 bg-neutral-500 object-cover transition ease-in-out duration-100 hover:scale-110"
                >
                    <box-icon class="absolute" name="image-add" size="2rem" />
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
</div>