import { createFileRoute } from "@tanstack/react-router";
import { findCover } from "@/lib/cover/find-cover.server";

export const Route = createFileRoute("/api/cover")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const q = new URL(request.url).searchParams.get("q") ?? "";
        const result = await findCover(q);
        const status = result.coverUrl ? 200 : result.error === "invalid_query" ? 400 : 404;
        return Response.json(result, { status });
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
        const status = result.coverUrl ? 200 : result.error === "invalid_query" ? 400 : 404;
        return Response.json(result, { status });
      },
    },
  },
});
