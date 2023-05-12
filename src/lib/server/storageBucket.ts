/**
 * @file Handles the upload/download of images to/from mongoDB
 */

import "$lib/server/db";
import mongoose from "mongoose";
import { Readable } from "stream";

/**
 * Creates a new GridFSBucket if mongoose is connected
 */
function connect() {
    if (mongoose.connection.readyState != 1) return;
    bookBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "bookImages",
    });
}

// Create and connect the GridFSBucket
let bookBucket: mongoose.mongo.GridFSBucket;
mongoose.connection.on("connection", connect);
connect(); // This is useful in Dev mode

/**
 * Describes the file's metadata stored on MongoDB
 */
interface Metadata {
    mimeType: string;
}

/**
 * Uploads an image to the book's storage bucket.
 * @param {Blob} blob - The image blob to upload.
 * @param {string} filename - The name to give to the uploaded image.
 * @returns {Promise<boolean>} A promise that resolves to true if the upload was successful, and false otherwise.
 * @throws Throws an error if an error occurs during the upload process.
 */
export async function uploadBookImage(blob: Blob, filename: string): Promise<boolean> {
    // Check if the provided blob is an image before attempting to upload it
    if (!blob.type.startsWith("image")) return false;

    // Create a writable stream to the storage bucket using the provided filename and metadata
    const stream = bookBucket.openUploadStream(filename, {
        metadata: { mimeType: blob.type } as Metadata,
    });

    // Pipe the readable stream from the blob into the writable stream
    const readable = new Readable({
        read() {
            const reader = blob.stream().getReader();
            const pump = async () => {
                const { done, value } = await reader.read();
                // If the reader is done reading, push null to signal that we piped everything through the stream
                if (done) {
                    this.push(null);
                } else {
                    // If there is data, pipe it and recursively call pump again
                    this.push(value);
                    await pump();
                }
            };
            // Start pumping
            pump()
                // Relay any error that might occur
                .catch((error) => this.emit("error", error));
        },
    });
    readable.pipe(stream);

    // Return a promise that resolves to true if the upload was successful.
    // The promise will reject with an error if an error occurs during the upload process.
    return new Promise((resolve, reject) => {
        readable.on("error", reject);
        stream.on("error", reject);
        stream.on("finish", () => resolve(true));
    });
}

/**
 * Downloads an image from the book's storage bucket with the specified filename.
 * @param {string} filename The name of the image to download.
 * @returns {Promise<{ data: Blob } & Metadata | null>} A promise that resolves to an object containing the image data as a Blob and its metadata, or null if the file could not be found.
 * @throws Throws an error if an error occurs during the download process.
 */
export async function downloadBookImage(
    filename: string
): Promise<({ data: Blob } & Metadata) | null> {
    // Create a readable stream from the storage bucket for the image file with the specified filename
    const stream = bookBucket.openDownloadStreamByName(filename);
    // Find the file data for the specified filename and get its metadata
    const fileData = (await bookBucket.find({ filename }).toArray())[0];

    // Create an array to hold the image data chunks
    const chunks: Uint8Array[] = [];

    try {
        // Set up event listeners for the readable stream that push each chunk into the chunks array as it is received
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
