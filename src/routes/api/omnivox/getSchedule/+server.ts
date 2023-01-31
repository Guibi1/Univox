import type { RequestHandler } from "../../$types";

export const POST = (async ({ request }) => {
    return await fetch("http://localhost:3000/api/omnivox/schedule", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: await request.text(),
    });
}) satisfies RequestHandler;
