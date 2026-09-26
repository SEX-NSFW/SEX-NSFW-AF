import { createFileRoute } from "@tanstack/react-router";
import { FETCH_HEADERS, isAllowedImageUrl } from "@/lib/cover/http.server";

export const Route = createFileRoute("/api/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const raw = new URL(request.url).searchParams.get("url") ?? "";
        if (!isAllowedImageUrl(raw)) {
          return new Response("Forbidden", { status: 403 });
        }
        try {
          const upstream = await fetch(raw, {
            headers: {
              ...FETCH_HEADERS,
              Accept: "image/jpeg,image/png,image/webp,image/*;q=0.8",
            },
            redirect: "follow",
            signal: AbortSignal.timeout(12000),
          });
          if (!upstream.ok) {
            return new Response("Not found", { status: 404 });
          }
          const ct = upstream.headers.get("content-type") || "image/jpeg";
          if (!ct.startsWith("image/")) {
            return new Response("Not an image", { status: 415 });
          }
          return new Response(upstream.body, {
            status: 200,
            headers: {
              "content-type": ct,
              "cache-control": "public, max-age=86400",
            },
          });
        } catch {
          return new Response("Upstream error", { status: 502 });
        }
      },
    },
  },
});
