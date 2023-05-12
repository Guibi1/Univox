const LOCAL_DEV_URL = "http://localhost:3000";
const PREVIEW_URL = process.env.ENVIRONMENT_URL;
const PROD_URL = "https://univox.guibi.ca";

const config = {
    headless: process.env.NODE_ENV !== "development",
    baseURL: process.env.NODE_ENV === "development" ? LOCAL_DEV_URL : PREVIEW_URL || PROD_URL,
    defaultViewPortSize: {
        width: 1280,
        height: 720,
    },
};

export class UnivoxPage {
    /** @type {import('@playwright/test').Page} */
    page;

    constructor(page) {
        this.page = page;
    }

    getAbsoluteURI(uri = "/") {
        return config.baseURL + uri;
    }

    async goto(uri = "/") {
        await this.page.setExtraHTTPHeaders({ origin: config.baseURL });
        await this.page.setViewportSize(config.defaultViewPortSize);
        return this.page.goto(this.getAbsoluteURI(uri));
    }

    async screenshot(data) {
        return this.page.screenshot({ ...data, path: `./checks/screenshots/${data.path}` });
    }
}
