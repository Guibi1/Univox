import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type ColorScheme = "light" | "dark";

function createColorSchemeStore() {
    const { subscribe, set: setStore } = writable<ColorScheme>("dark");
    let bc: BroadcastChannel;

    if (browser) {
        bc = new BroadcastChannel("New colorScheme data");
        bc.addEventListener("message", (e) => apply(e.data));
    }

    function apply(color: ColorScheme) {
        setStore(color);
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-colorScheme", color);
        }
    }

    function toggle() {
        let color;
        subscribe((c) => (color = c))();
        set(color === "dark" ? "light" : "dark");
    }

    function set(color: ColorScheme) {
        apply(color);
        fetch("/api/colorScheme", {
            method: "PUT",
            body: color,
        });
        if (bc) bc.postMessage(color);
    }

    return {
        subscribe,
        setInitial: setStore,
        set,
        toggle,
    };
}

const colorScheme = createColorSchemeStore();
export default colorScheme;
