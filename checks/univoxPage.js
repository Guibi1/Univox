import config from "../checkly.config";

export class UnivoxPage {
    constructor(page) {
        this.page = page;
    }

    async goto(uri = "/") {
        await this.page.setViewportSize(config.defaultViewPortSize);
        return this.page.goto(config.baseURL + uri);
    }

    async screenshot(data) {
        return this.page.screenshot({ ...data, path: `./checks/screenshots/${data.path}` });
    }
}
