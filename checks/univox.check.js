import { expect, test } from "@playwright/test";
import { UnivoxPage } from "./univoxPage";

import AuthCheck from "./auth.check";

test("load site and take a screenshot", async ({ page }) => {
    const univox = new UnivoxPage(page);
    const res = await univox.goto();

    expect(res.status()).toBeLessThan(400);

    await univox.screenshot({ path: "home.png", fullPage: true });
});

test("evaluate performance metrics", async ({ page }) => {
    const univox = new UnivoxPage(page);
    await univox.goto();

    // Inject a PerformanceObserver and access web performance metrics
    const LCP = await page.evaluate(() => {
        return new Promise((resolve) => {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const LCP = entries.at(-1);
                resolve(LCP.startTime);
            }).observe({
                type: "largest-contentful-paint",
                buffered: true,
            });
        });
    });

    // Add custom assertions to fail your check
    // if your web performance degraded
    console.log("Largest Contentful Paint", parseInt(LCP, 10));
    expect(parseInt(LCP, 10)).toBeLessThan(1000);
});

test.describe("auth routes", AuthCheck);
