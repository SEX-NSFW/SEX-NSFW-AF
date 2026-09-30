const STOP = new Set([
  "a",
  "an",
  "the",
  "of",
  "and",
  "or",
  "to",
  "in",
  "on",
  "for",
  "with",
  "my",
  "her",
  "his",
  "she",
  "he",
  "is",
  "from",
  "by",
  "at",
  "as",
  "it",
  "this",
  "that",
  "video",
  "scene",
  "porn",
  "xxx",
  "official",
  "hd",
  "com",
  "www",
  "watch",
  "full",
  "free",
  "starring",
  "feat",
  "featuring",
]);

export const STUDIO_ALIASES: { keys: string[]; name: string; code?: string; host?: string; thenude?: string }[] =
  [
    {
      keys: ["family strokes", "familystrokes", "family-strokes"],
      name: "Family Strokes",
      code: "fs",
      host: "www.familystrokes.com",
    },
    {
      keys: ["perv mom", "pervmom", "perv-mom"],
      name: "PervMom",
      code: "pvm",
      host: "www.pervmom.com",
    },
    {
      keys: ["sis loves me", "sislovesme", "sis-loves-me"],
      name: "SisLovesMe",
      code: "slm",
      host: "www.sislovesme.com",
    },
    {
      keys: ["dad crush", "dadcrush", "dad-crush"],
      name: "DadCrush",
      code: "dc",
      host: "www.dadcrush.com",
    },
    {
      keys: ["mom is horny", "momishorny", "mom-is-horny"],
      name: "MomIsHorny",
      code: "mih",
      host: "www.momishorny.com",
    },
    {
      keys: ["bratty sis", "brattysis", "bratty sis.com", "brattysis.com"],
      name: "Bratty Sis",
      thenude: "brattysis",
    },
    {
      keys: ["moms teach sex", "momsteachsex", "mom teach sex"],
      name: "Moms Teach Sex",
      thenude: "momsteachsex",
    },
    {
      keys: ["nubiles porn", "nubiles-porn", "nubilesporn", "nubiles"],
      name: "Nubiles",
      thenude: "nubiles",
    },
    { keys: ["brazzers"], name: "Brazzers", thenude: "brazzers" },
    { keys: ["team skeet", "teamskeet"], name: "TeamSkeet" },
  ];

const STUDIO_PREFIXES: { prefix: string; name: string }[] = [
  { prefix: "brattysis-", name: "Bratty Sis" },
  { prefix: "nubilesporn-", name: "Nubiles" },
  { prefix: "brazzers-", name: "Brazzers" },
  { prefix: "bangbros-", name: "BangBros" },
  { prefix: "reality-kings-", name: "Reality Kings" },
  { prefix: "girlsway-", name: "Girlsway" },
  { prefix: "kink-", name: "Kink" },
  { prefix: "mofos-", name: "Mofos" },
  { prefix: "tushy-", name: "Tushy" },
  { prefix: "blacked-", name: "Blacked" },
  { prefix: "vixen-", name: "Vixen" },
  { prefix: "puretaboo-", name: "Pure Taboo" },
  { prefix: "familysinners-", name: "Family Sinners" },
];

export function decodeHtml(input: string): string {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/'/gi, "'")
    .replace(/&#0*39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

export function detectStudios(query: string): (typeof STUDIO_ALIASES)[number][] {
  const n = normalizeTitle(query);
  return STUDIO_ALIASES.filter((s) => s.keys.some((k) => n.includes(k)));
}

export function stripStudios(text: string): string {
  let n = normalizeTitle(text);
  const keys = STUDIO_ALIASES.flatMap((s) => s.keys).sort(
    (a, b) => b.length - a.length,
  );
  for (const key of keys) {
    n = n.replaceAll(key, " ");
  }
  return n.replace(/\s+/g, " ").trim();
}

export function studioFromSlug(slug: string): string | null {
  const lower = slug.toLowerCase();
  for (const { prefix, name } of STUDIO_PREFIXES) {
    if (lower.startsWith(prefix)) return name;
  }
  return null;
}

export function normalizeTitle(s: string): string {
  let t = decodeHtml(s).toLowerCase();
  t = t.replace(/[’'`]/g, "");
  t = t.replace(/s(\d+)\s*[:\-.]?\s*e(\d+)/gi, " s$1 e$2 ");
  t = t.replace(/\bstep[\s-]*mom\b/g, "stepmom");
  t = t.replace(/\bstep[\s-]*mother\b/g, "stepmom");
  t = t.replace(/\bstep[\s-]*daughter\b/g, "stepdaughter");
  t = t.replace(/\bstep[\s-]*sister\b/g, "stepsister");
  t = t.replace(/\bstep[\s-]*bro(?:ther)?\b/g, "stepbrother");
  t = t.replace(/\bstep[\s-]*dad\b/g, "stepdad");
  t = t.replace(/\bstep[\s-]*father\b/g, "stepdad");
  t = t.replace(/[^a-z0-9]+/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

export function meaningfulTokens(s: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of normalizeTitle(s).split(" ")) {
    if (w.length < 2 || STOP.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

export type MatchResult = {
  ok: boolean;
  score: number;
  overlap: number;
};

export function isStrongMatch(
  query: string,
  title: string,
  extra = "",
): MatchResult {
  const qExact = stripStudios(query);
  const tExact = stripStudios(title);
  if (!qExact || !tExact) return { ok: false, score: 0, overlap: 0 };

  if (qExact === tExact) {
    return { ok: true, score: 100, overlap: meaningfulTokens(qExact).length };
  }

  const qt = meaningfulTokens(qExact);
  const tt = meaningfulTokens(`${tExact} ${extra}`);
  const overlap = qt.filter((tok) => tt.includes(tok));
  const union = new Set([...qt, ...tt]);
  const jaccard = union.size ? overlap.length / union.size : 0;

  if (overlap.length >= 3) {
    const extraPenalty = Math.max(0, tt.length - overlap.length) * 1.5;
    return {
      ok: true,
      score: 40 + overlap.length * 8 + jaccard * 20 - extraPenalty,
      overlap: overlap.length,
    };
  }

  return { ok: false, score: overlap.length + jaccard, overlap: overlap.length };
}

export function slugifyTitle(title: string): string[] {
  const base = stripStudios(title)
    .replace(/s(\d+)\s+e(\d+)/g, "s$1-e$2")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const variants = new Set<string>();
  if (base) variants.add(base);

  const collapsed = base
    .replace(/step-mom/g, "stepmom")
    .replace(/step-daughter/g, "stepdaughter")
    .replace(/step-sister/g, "stepsister");
  if (collapsed) variants.add(collapsed);

  const expanded = base
    .replace(/stepmom/g, "step-mom")
    .replace(/stepdaughter/g, "step-daughter")
    .replace(/stepsister/g, "step-sister");
  if (expanded) variants.add(expanded);

  return [...variants];
}

export function pickBestMatch<T>(
  items: T[],
  query: string,
  getTitle: (item: T) => string,
  getExtra?: (item: T) => string,
): { item: T; match: MatchResult } | null {
  let best: { item: T; match: MatchResult } | null = null;
  for (const item of items) {
    const match = isStrongMatch(
      query,
      getTitle(item),
      getExtra ? getExtra(item) : "",
    );
    if (!match.ok) continue;
    if (!best || match.score > best.match.score) best = { item, match };
  }
  return best;
}
