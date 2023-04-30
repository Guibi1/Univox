import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const AuthCheck = () => {
    test("Login with bad credentials", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "da" on <input> [name="da"]
        await page.fill('[name="email"]', "0000000");

        // Fill "password" on <input> [name="password"]
        await page.fill('[name="password"]', "00000000");

        // Click on <button> "Se connecter"
        await page.click('[type="submit"]');

        await expect(page.locator("text=Mot de passe erroné")).toBeVisible();
        await expect(page).toHaveURL(univox.getAbsoluteURI("/connexion"));
    });

    test("Login with good credentials and sign out", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "da" on <input> [name="da"]
        await page.fill('[name="email"]', process.env.EMAIL);

        // Fill "password" on <input> [name="password"]
        await page.fill('[name="password"]', process.env.PASSWORD);

        // Click on <button> "Se connecter"
        await page.click('[type="submit"]');
        await expect(page).toHaveURL(univox.getAbsoluteURI("/"));

        await page.click("nav .grid:nth-child(2) button");

        // Click on <a> "Déconnexion"
        await page.click('a[href="/deconnexion"]');
        await expect(page).toHaveURL(univox.getAbsoluteURI("/connexion"));
    });
};

export default AuthCheck;
