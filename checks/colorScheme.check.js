import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const ColorSchemeCheck = () => {
    test("Dark mode is enabled by default", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "dark");
    });

    test("Color scheme button switches to light mode and back", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Click on <button> [aria-label="th\E8me du site"]
        await page.click('[aria-label="thE8me du site"]');
        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "light");

        // Click on <button> [aria-label="th\E8me du site"]
        await page.click('[aria-label="thE8me du site"]');
        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "dark");
    });

    test("Color scheme is consistent across refresh", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Click on <button> [aria-label="th\E8me du site"]
        await page.click('[aria-label="thE8me du site"]');
        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "light");

        await page.reload();

        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "light");
    });
};

export default ColorSchemeCheck;
