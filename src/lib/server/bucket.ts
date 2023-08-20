import { GOOGLE_CLOUD_CREDENTIALS } from "$env/static/private";
import { Storage } from "@google-cloud/storage";
import { generateRandomString } from "lucia/utils";
import sharp from "sharp";

const storage = new Storage({ credentials: JSON.parse(GOOGLE_CLOUD_CREDENTIALS) });

export async function uploadBookCover(image: File) {
    const filename = generateRandomString(30);
    const file = storage.bucket(StorageBucket.books).file(filename);

    const buffer = await sharp(await image.arrayBuffer())
        .resize({ width: 400, height: 600, fit: "inside" })
        .webp()
        .toBuffer();

    await file.save(buffer, { contentType: "image/webp", public: true });
    return file.publicUrl();
}

export async function deleteBookCover(src: string) {
    const filename = src.slice(src.indexOf(StorageBucket.books) + StorageBucket.books.length + 1);
    const file = storage.bucket(StorageBucket.books).file(filename);

    try {
        await file.delete();
        return true;
    } catch {
        return false;
    }
}

enum StorageBucket {
    books = "books-bucket-univox",
}
