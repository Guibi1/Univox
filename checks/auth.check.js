import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const AuthCheck = () => {
    test("Login with bad credentials", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "da" on <input> [name="da"]
        await page.fill('input[name="da"]', "0000000");

        // Fill "password" on <input> [name="password"]
        await page.fill('input[name="password"]', "00000000");

        // Click on <button> "Se connecter"
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(univox.getAbsoluteURI("/connexion"));
        await expect(page.locator("text=Mot de passe erroné")).toBeVisible();
    });

    test("Login with good credentials and sign out", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "da" on <input> [name="da"]
        await page.fill('input[name="da"]', process.env.DA);

        // Fill "password" on <input> [name="password"]
        await page.fill('input[name="password"]', process.env.PASSWORD);

        // Click on <button> "Se connecter"
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(univox.getAbsoluteURI("/"));

        // Click on <a> "Déconnexion"
        await page.click('a[href="/deconnexion"]');
        await expect(page).toHaveURL(univox.getAbsoluteURI("/connexion"));
    });
};

export default AuthCheck;
