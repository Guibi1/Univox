/**
 * @file API endpoint to fetch an image from the database
 */

import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Returns the requested image
 */
export const GET = (async ({ setHeaders, params }) => {
    const img = "";
    if (!img) throw error(404, "File not found");

    // Set response headers for the image
    setHeaders({
        "Content-Type": "img.mimeType",
        "Content-Length": "img.data.size.toString()",
        "Cache-Control": "public, max-age=600",
    });

    return new Response(img);
}) satisfies RequestHandler;
