<script lang="ts">
    import classNames from "classnames";

    // Importing easing function for fade transition
    import { cubicInOut } from "svelte/easing";

    // Constants and exported variables
    export const maxImagesCount = 4;
    export let images: string[] = [];
    export let files: File[] = [];
    export let readOnly = false;
    export let selectedIndex = readOnly ? 0 : -1;

    // Local state for drag event handling
    let isDragginOver = false;

    // Function to remove an image from the images array
    function removeImage(index: number) {
        images.splice(index, 1);
        files.splice(index, 1);
        // Triggering reactivity in Svelte
        images = images;
        // Updating the selected index after removal
        selectedIndex = !images[selectedIndex] ? selectedIndex - 1 : selectedIndex;
    }

    // Function to handle file input change event
    function handleUpload(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        if (!e.currentTarget.files) return;
        readImages(e.currentTarget.files);
    }

    // Function to handle drop event for file drag and drop
    function handleDrop(e: DragEvent) {
        e.preventDefault();
        if (!e.dataTransfer) return;
        readImages(e.dataTransfer.files);
        isDragginOver = false;
    }

    // Function to read image files and update the images and files arrays
    function readImages(filelist: FileList) {
        for (let file of filelist) {
            if (file.type !== "image/png" && file.type !== "image/jpeg") return;
            if (images.length >= maxImagesCount) return;
            let reader = new FileReader();
            reader.addEventListener("loadend", (e) => {
                if (images.length >= maxImagesCount) return;
                let newImage = e.target?.result as string;
                if (!images.includes(newImage) && images.length < 5) {
                    images = [...images, newImage];
                    files.push(file);
                    selectedIndex += 1;
                }
            });
            reader.readAsDataURL(file);
        }
    }

    // Custom action for handling drag and drop events
    function dropFiles(node: HTMLElement, enabled: boolean) {
        // Function to handle dragover event
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        };

        // Function to enable or disable drag and drop event listeners
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

    // Fade transition for drag and drop overlay
    function fade(node: HTMLElement) {
        const o = +getComputedStyle(node).opacity;
        return {
            duration: 250,
            easing: cubicInOut,
            css: (t: number) => `opacity: ${t * o}`,
        };
    }
</script>

<!-- Main container -->
<div class="relative py-4">
    <div
        use:dropFiles={images.length < maxImagesCount && !readOnly}
        on:dragenter={() => (isDragginOver = images.length < maxImagesCount && !readOnly)}
        class="relative flex h-64 items-stretch bg-neutral-700"
        role="form"
    >
        {#if images.length === 0}
            <!-- Empty state with file input and label -->
            <label class="flex cursor-pointer flex-col items-center justify-center">
                <i class="bx bx-cloud-upload pointer-events-none text-7xl" />
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
            <!-- Displaying the selected image -->
            <img
                src={images[selectedIndex]}
                alt="Livre"
                class="pointer-events-none h-full w-full object-cover"
            />

            {#if !readOnly}
                <!-- Remove button for the selected image -->
                <button
                    type="button"
                    on:click={() => removeImage(selectedIndex)}
                    class="absolute right-2 top-2"
                >
                    <i class="bx bx-trash text-3xl text-red-500" />
                </button>
            {/if}
        {/if}

        {#if isDragginOver && !readOnly}
            <!-- Drag and drop overlay with fade transition -->
            <div
                transition:fade
                on:dragleave={() => (isDragginOver = false)}
                class="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-1 bg-blue-secondary"
                role="form"
            >
                <i class="bx bx-cloud-upload pointer-events-none text-7xl" />
                <p class="pointer-events-none">Glissez ici des images de votre livre</p>
            </div>
        {/if}
    </div>

    <!-- Thumbnail container -->
    <div class="flex h-12 items-center justify-center">
        <div class="z-20 flex gap-2">
            {#each images as image, i}
                <!-- Thumbnail for each image with click handler -->
                <button type="button" on:click={() => (selectedIndex = i)}>
                    <img
                        src={image}
                        class={classNames(
                            "aspect-square w-20 cursor-pointer border-2 object-cover transition duration-100 ease-in-out hover:scale-110",
                            selectedIndex === i ? "border-blue-primary" : "border-neutral-300"
                        )}
                        alt=""
                    />
                </button>
            {/each}

            {#if images.length < maxImagesCount && !readOnly}
                <!-- Add image button with file input and label -->
                <label
                    class="flex aspect-square w-20 cursor-pointer items-center justify-center border-2 border-neutral-300 bg-neutral-500 object-cover transition-[scale] hover:scale-110"
                >
                    <i class="bx bx-image-add absolute text-4xl" />
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
