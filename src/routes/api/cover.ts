import { createFileRoute } from "@tanstack/react-router";
import { findCover } from "@/lib/cover/find-cover.server";

export const Route = createFileRoute("/api/cover")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const q = new URL(request.url).searchParams.get("q") ?? "";
        const result = await findCover(q);
        // Always 200 with JSON body so the client can distinguish not_found from a dead deploy.
        return Response.json(result, {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        });
      },
      POST: async ({ request }) => {
        let q = "";
        try {
          const body = (await request.json()) as { q?: string; query?: string };
          q = String(body.q ?? body.query ?? "");
        } catch {
          q = "";
        }
        const result = await findCover(q);
        return Response.json(result, {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
