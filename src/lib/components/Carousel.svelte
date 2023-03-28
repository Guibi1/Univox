<script lang="ts">
    import { cubicInOut } from "svelte/easing";

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

    function fade(node: HTMLElement) {
        const o = +getComputedStyle(node).opacity;
        return {
            duration: 250,
            easing: cubicInOut,
            css: (t: number) => `opacity: ${t * o}`,
        };
    }
</script>

<div class="relative py-4">
    <div
        use:dropFiles={images.length < maxImagesCount && !readOnly}
        on:dragenter={() => (isDragginOver = images.length < maxImagesCount && !readOnly)}
        class="relative flex h-64 items-stretch bg-neutral-700"
    >
        {#if images.length === 0}
            <label class="flex cursor-pointer flex-col items-center justify-center">
                <box-icon class="pointer-events-none" name="cloud-upload" size="4rem" />
                <p class="pointer-events-none">Glissez ici des images de votre livre</p>

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
                class={`pointer-events-none h-full w-full object-cover`}
            />

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

        {#if isDragginOver && !readOnly}
            <div
                transition:fade
                on:dragleave={() => (isDragginOver = false)}
                class="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-1 bg-blue-secondary"
            >
                <box-icon class="pointer-events-none" name="cloud-upload" size="4rem" />
                <p class="pointer-events-none">Glissez ici des images de votre livre</p>
            </div>
        {/if}
    </div>

    <div class="flex h-12 items-center justify-center">
        <div class="z-20 flex gap-2">
            {#each images as image, i}
                <button type="button" on:click={() => (selectedIndex = i)}>
                    <img
                        src={image}
                        class={`aspect-square w-20 cursor-pointer border-2 object-cover transition duration-100 ease-in-out hover:scale-110 ${
                            selectedIndex === i ? "border-blue-primary" : "border-neutral-300"
                        }`}
                        alt=""
                    />
                </button>
            {/each}

            {#if images.length < maxImagesCount && !readOnly}
                <label
                    class="flex aspect-square w-20 cursor-pointer items-center justify-center border-2 border-neutral-300 bg-neutral-500 object-cover transition-[scale] hover:scale-110"
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
