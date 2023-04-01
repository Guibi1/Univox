import { downloadBookImage } from "$lib/server/storageBucket";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals, setHeaders, params }) => {
    if (!locals.user) throw error(401);

    const img = await downloadBookImage(params.filename);
    if (!img) throw error(404, "File not found");

    // set response headers for image
    setHeaders({
        "Content-Type": img.mimeType,
        "Content-Length": img.data.size.toString(),
        "Cache-Control": "public, max-age=600",
    });

    return new Response(img.data);
}) satisfies RequestHandler;
