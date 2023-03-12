import config from "../checkly.config";

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
        await this.page.setViewportSize(config.defaultViewPortSize);
        return this.page.goto(this.getAbsoluteURI(uri));
    }

    async screenshot(data) {
        return this.page.screenshot({ ...data, path: `./checks/screenshots/${data.path}` });
    }
}
