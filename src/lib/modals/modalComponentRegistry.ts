import type { ModalComponent } from "@skeletonlabs/skeleton";

import AddFriendModal from "./AddFriendModal.svelte";
import CreateGroupModal from "./CreateGroupModal.svelte";

export const modalComponentRegistry: Record<string, ModalComponent> = {
    "add-friend": { ref: AddFriendModal },
    "create-group": { ref: CreateGroupModal },
};
