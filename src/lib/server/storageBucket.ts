import "$lib/server/db";
import mongoose from "mongoose";
import { Readable } from "stream";

function connect() {
    if (mongoose.connection.readyState != 1) return;
    bookBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "bookImages",
    });
}

let bookBucket: mongoose.mongo.GridFSBucket;
mongoose.connection.on("connection", connect);
connect();

type Metadata = {
    mimeType: string;
};

export async function uploadBookImage(blob: Blob, filename: string): Promise<boolean> {
    if (!blob.type.startsWith("image")) return false;

    const stream = bookBucket.openUploadStream(filename, {
        metadata: { mimeType: blob.type } as Metadata,
    });

    const readable = new Readable({
        read() {
            const reader = blob.stream().getReader();
            const pump = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    this.push(null);
                    return;
                }
                this.push(value);
                await pump();
            };
            pump().catch((error) => this.emit("error", error));
        },
    });
    readable.pipe(stream);

    return new Promise((resolve, reject) => {
        readable.on("error", reject);
        stream.on("error", reject);
        stream.on("finish", () => resolve(true));
    });
}

export async function downloadBookImage(filename: string) {
    const stream = bookBucket.openDownloadStreamByName(filename);
    const fileData = (await bookBucket.find({ filename }).toArray())[0];
    const chunks: Uint8Array[] = [];

    try {
        await new Promise<void>((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on("error", (err) => reject(err));
            stream.on("end", resolve);
        });
    } catch (e) {
        return null;
    }

    return { data: new Blob(chunks), ...(fileData.metadata as Metadata) };
}
