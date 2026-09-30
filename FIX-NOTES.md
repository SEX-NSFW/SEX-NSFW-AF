# SceneCover fix (2026-09-30)

## Bugs fixed
1. Strong match required 3 tokens → short titles like "Family Vacation!!!" always failed.
   Now: if query has 1–2 tokens, all must match; if longer, still need 3.
2. TeamSkeet /movies/{slug} pages rejected when title token-overlap < 3 even if slug matched.
   Now: slug path match is accepted.
3. Search order: Hub (TeamSkeet/psmcdn) before aggregator.
4. /api/cover always returns HTTP 200 + JSON (avoids client treating missing deploy as not_found).

## Redeploy on Vercel
- Root directory: project root (package.json present)
- Build: npm run build
- After deploy test: GET /api/cover?q=Prom%20Night%20Pussy%20Practice
- Expect JSON with coverUrl pointing at images.psmcdn.net/.../shared/hi.jpg

## Acceptance
- "Family Vacation!!!" or "Family Vacation!!! Family Strokes" → cover
- "Prom Night Pussy Practice" → melody_marks hi.jpg cover
