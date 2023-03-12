import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const AuthCheck = () => {
    test("Login with bad credentials", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "da" on <input> [name="da"]
        await page.fill('[name="da"]', "0000000");

        // Fill "password" on <input> [name="password"]
        await page.fill('[name="password"]', "00000000");

        // Click on <button> "Se connecter"
        await page.click('[type="submit"]');

        await expect(page.getByText("Mot de passe erroné")).toBeVisible();
        expect(page.url()).toMatch(univox.getAbsoluteURI("/connexion"));
    });

    test("Login with good credentials", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/connexion");

        // Fill "da" on <input> [name="da"]
        await page.fill('[name="da"]', process.env.DA);

        // Fill "password" on <input> [name="password"]
        await page.fill('[name="password"]', process.env.PASSWORD);

        // Click on <button> "Se connecter"
        await page.click('[type="submit"]');

        expect(page.url()).toMatch(univox.getAbsoluteURI("/"));
    });
};

export default AuthCheck;
