import { writable } from "svelte/store";

type ColorScheme = "light" | "dark";

function createColorSchemeStore() {
    const { subscribe, set } = writable<ColorScheme>("dark");

    function setColorScheme(color: ColorScheme) {
        set(color);

        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-colorScheme", color);
        }
        if (typeof localStorage !== "undefined") {
            console.log("set!", color);
            localStorage.setItem("colorScheme", color);
        }
    }

    function onMount() {
        let isDark = true;
        if (localStorage.getItem("colorScheme")) {
            if (localStorage.getItem("colorScheme") == "light") {
                isDark = false;
            }
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            isDark = false;
        }
        setColorScheme(isDark ? "dark" : "light");
    }

    return {
        subscribe,
        set: setColorScheme,
        onMount,
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
