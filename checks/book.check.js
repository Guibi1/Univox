import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

const BookCheck = () => {
    test("The Nav button correctly redirects", async ({ page }) => {
        const univox = new UnivoxPage(page);
        await univox.goto("/");

        await page.click('nav a[href="/livres"]');

        await expect(page).toHaveURL(univox.getAbsoluteURI("/livres/achat"));
    });
};

export default BookCheck;
