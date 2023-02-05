import { writable } from "svelte/store";

export type ColorScheme = "light" | "dark";

function createColorSchemeStore() {
    const { subscribe, set } = writable<ColorScheme>("dark");

    function setColorScheme(color: ColorScheme) {
        set(color);
        fetch("/api/colorScheme", {
            method: "PUT",
            body: color,
        });

        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-colorScheme", color);
        }
    }

    return {
        subscribe,
        set: setColorScheme,
        setInitial: set,
    };
}

const colorScheme = createColorSchemeStore();
export default colorScheme;

function createColorSchemeIsDark() {
    const { subscribe, set } = writable<boolean>(true);
    colorScheme.subscribe((color) => set(color === "dark"));

    return {
        subscribe,
        set: (isDark: boolean) => colorScheme.set(isDark ? "dark" : "light"),
    };
}

export const colorSchemeIsDark = createColorSchemeIsDark();
