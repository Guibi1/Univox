import type { ModalComponent } from "@skeletonlabs/skeleton";

import AddFriendModal from "./AddFriendModal.svelte";

export const modalComponentRegistry: Record<string, ModalComponent> = {
    "add-friend": { ref: AddFriendModal },
};
