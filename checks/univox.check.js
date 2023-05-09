import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

// Check Groups
import AuthCheck from "./auth.check";
import BookCheck from "./book.check";
import ColorSchemeCheck from "./colorScheme.check";

// Check order
test.describe("Auth routes", AuthCheck);
test.describe("Color Scheme", ColorSchemeCheck);

test.describe("Logged in", () => {
    test.beforeAll(async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "email" on <input> [name="email"]
        await page.fill('input[name="email"]', process.env.EMAIL);

        // Fill "password" on <input> [name="password"]
        await page.fill('input[name="password"]', process.env.PASSWORD);

        // Click on <button> "Se connecter"
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(univox.getAbsoluteURI("/"));
    });

    test.describe("Book routes", BookCheck);

    test.afterAll(async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/deconnexion");
    });
});
