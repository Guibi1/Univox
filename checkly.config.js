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

export default config;
