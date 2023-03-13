import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const ColorSchemeCheck = () => {
    test("Color scheme button works and is consistent between refreshes", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "dark");

        // Click on <button> [aria-label="thème du site"] and wait for the PUT request
        const colorschemeAPI = page.waitForResponse(univox.getAbsoluteURI("/api/colorScheme"));
        await page.click('[aria-label="thème du site"]');
        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "light");
        await colorschemeAPI;

        await page.reload();
        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "light");

        // Click on <button> [aria-label="thème du site"]
        await page.click('[aria-label="thème du site"]');
        await expect(page.locator("html")).toHaveAttribute("data-colorscheme", "dark");
    });
};

export default ColorSchemeCheck;
