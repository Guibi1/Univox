import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const BookCheck = () => {
    test("The Nav button correctly redirects", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/");

        await page.click("nav > a[href=/livres]");

        await expect(page).toHaveURL("/livres/achat");
    });

    test("The user can switch between the list of books and their books", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/");

        // Click on <a> "Mes livres"
        await page.click('a[href="mes-livres"]');
        await expect(page).toHaveURL("/livres/mes-livres");

        // Click on <a> "Acheter"
        await page.click('a[href="achat"]');
        await expect(page).toHaveURL("/livres/achat");
    });
};

export default BookCheck;
