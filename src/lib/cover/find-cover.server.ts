import {
  attr,
  fetchHtml,
  preferHiJpg,
  toCdnPorndiff,
  unwrapPsmcdn,
  verifyImage,
} from "./http.server";
import {
  decodeHtml,
  detectStudios,
  isStrongMatch,
  pickBestMatch,
  slugifyTitle,
  studioFromSlug,
  STUDIO_ALIASES,
} from "./match";
import type { CoverResult } from "./types";

type SearchHit = {
  slug: string;
  title: string;
  poster: string | null;
  performers: string[];
  pageUrl: string;
};

const CODE_STUDIO: Record<string, string> = {
  fs: "Family Strokes",
  pvm: "PervMom",
  slm: "SisLovesMe",
  dc: "DadCrush",
  mih: "MomIsHorny",
};

function empty(error: CoverResult["error"]): CoverResult {
  return {
    coverUrl: null,
    title: null,
    studio: null,
    source: null,
    performers: [],
    pageUrl: null,
    error,
  };
}

async function firstVerified(urls: string[]): Promise<string | null> {
  const seen = new Set<string>();
  for (const raw of urls) {
    if (!raw) continue;
    const url = raw.replace(/\\/g, "").trim();
    if (!url.startsWith("https://") || seen.has(url)) continue;
    seen.add(url);
    const ok = await verifyImage(url);
    if (ok) return ok;
  }
  return null;
}

function parsePorndiffSearch(html: string): SearchHit[] {
  const hits: SearchHit[] = [];
  const re =
    /<a href="(https:\/\/(?:en\.)?porndiff\.com\/videos\/([^"]+))"\s+title="([^"]*)"[^>]*class="font-medium leading-5 font-title[^"]*"[^>]*>([^<]+)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const pageUrl = m[1].replace("https://porndiff.com/", "https://en.porndiff.com/");
    const slug = m[2];
    const title = decodeHtml(m[4] || m[3] || "");
    const windowStart = Math.max(0, m.index - 3500);
    const windowEnd = Math.min(html.length, m.index + 1800);
    const around = html.slice(windowStart, windowEnd);
    const posterMatch =
      around.match(
        /https:\\\/\\\/cdn\.porndiff\.com\\\/tubes\\\/[^"'\\\s]+\.(?:jpg|jpeg|png|webp)/i,
      ) ||
      around.match(
        /https:\/\/cdn\.porndiff\.com\/tubes\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i,
      );
    const poster = posterMatch
      ? posterMatch[0].replace(/\\\//g, "/")
      : `https://cdn.porndiff.com/tubes/${slug}_poster_01.jpg`;
    const performers = [
      ...around.matchAll(
        /href="https:\/\/en\.porndiff\.com\/actors\/[^"]+"[^>]*>([^<]+)<\/a>/g,
      ),
    ].map((x) => decodeHtml(x[1].trim()));
    hits.push({
      slug,
      title,
      poster,
      performers: [...new Set(performers)].slice(0, 8),
      pageUrl,
    });
  }
  if (!hits.length) {
    const loose =
      /href="https:\/\/(?:en\.)?porndiff\.com\/videos\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    const seen = new Set<string>();
    let n: RegExpExecArray | null;
    while ((n = loose.exec(html))) {
      const slug = n[1];
      if (seen.has(slug)) continue;
      seen.add(slug);
      hits.push({
        slug,
        title: decodeHtml(n[2]),
        poster: `https://cdn.porndiff.com/tubes/${slug}_poster_01.jpg`,
        performers: [],
        pageUrl: `https://en.porndiff.com/videos/${slug}`,
      });
    }
  }
  return hits;
}

async function enrichPorndiff(hit: SearchHit): Promise<{
  studio: string | null;
  coverCandidates: string[];
  title: string;
}> {
  const candidates: string[] = [
    `https://cdn.porndiff.com/tubes/${hit.slug}_poster_01.jpg`,
    `https://cdn.porndiff.com/tubes/${hit.slug}.jpg`,
  ];
  if (hit.poster) candidates.push(toCdnPorndiff(hit.poster));

  const html = await fetchHtml(hit.pageUrl, 10000);
  if (!html) {
    return {
      studio: studioFromSlug(hit.slug),
      coverCandidates: candidates,
      title: hit.title,
    };
  }

  const og = attr(html, "og:image");
  if (og) candidates.push(toCdnPorndiff(og));
  const cdn = html.match(
    /https:\/\/cdn\.porndiff\.com\/tubes\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/i,
  );
  if (cdn) candidates.push(cdn[0].replace(/\\\//g, "/"));

  let studio: string | null = studioFromSlug(hit.slug);
  const company = html.match(
    /"productionCompany"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/,
  );
  if (company) studio = decodeHtml(company[1]);
  const ogTitle = attr(html, "og:title");
  return {
    studio,
    coverCandidates: candidates,
    title: ogTitle ? decodeHtml(ogTitle) : hit.title,
  };
}

async function searchPorndiff(query: string): Promise<CoverResult | null> {
  const url = `https://en.porndiff.com/search/?q=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url, 14000);
  if (!html) return null;
  const hits = parsePorndiffSearch(html);
  if (!hits.length) return null;
  const best = pickBestMatch(
    hits,
    query,
    (h) => h.title,
    (h) => `${h.slug.replace(/-/g, " ")} ${h.performers.join(" ")}`,
  );
  if (!best) return null;
  const extra = await enrichPorndiff(best.item);
  const coverUrl = await firstVerified(extra.coverCandidates);
  if (!coverUrl) return { ...empty("unverified"), title: extra.title, source: "porndiff" };
  return {
    coverUrl,
    title: extra.title,
    studio: extra.studio,
    source: "porndiff",
    performers: best.item.performers,
    pageUrl: best.item.pageUrl,
  };
}

function psmcdnFromPage(html: string): string | null {
  const og = attr(html, "og:image");
  const raw = og ? unwrapPsmcdn(og) : null;
  const direct =
    html.match(
      /https:\/\/images\.psmcdn\.net\/(?:cdn-cgi\/image\/[^/]+\/)?teamskeet\/[a-z]+\/[a-z0-9_]+\/shared\/(?:hi|med)\.jpg/i,
    )?.[0] ?? null;
  const url = raw || (direct ? unwrapPsmcdn(direct) : null);
  return url ? preferHiJpg(url) : null;
}

function performerFromPsmcdn(url: string): string[] {
  const m = url.match(/\/teamskeet\/[a-z]+\/([a-z0-9_]+)\//i);
  if (!m) return [];
  const slug = m[1].replace(/\d+$/, "");
  const name = slug
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return name ? [name] : [];
}

function studioFromPsmcdn(url: string): string | null {
  const m = url.match(/\/teamskeet\/([a-z]+)\//i);
  return m ? (CODE_STUDIO[m[1]] ?? null) : null;
}

async function lookupTeamSkeetPage(
  url: string,
  query: string,
): Promise<CoverResult | null> {
  try {
    const html = await fetchHtml(url, 10000);
    if (!html) return null;
    const pageTitle =
      attr(html, "og:title") ||
      decodeHtml((html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "").split("|")[0] ?? "");
    const title = pageTitle.replace(/\s+\|\s+.*$/, "").trim();
    if (!title) return null;
    const match = isStrongMatch(query, title);
    if (!match.ok) return null;
    const cover = psmcdnFromPage(html);
    if (!cover) return null;
    const hi = await verifyImage(cover);
    const med = hi
      ? hi
      : await verifyImage(cover.replace("/shared/hi.jpg", "/shared/med.jpg"));
    if (!med) return null;
    const performers = performerFromPsmcdn(med);
    return {
      coverUrl: med,
      title,
      studio: studioFromPsmcdn(med),
      source: "teamskeet",
      performers,
      pageUrl: url,
    };
  } catch {
    return null;
  }
}

async function searchTeamSkeet(query: string): Promise<CoverResult | null> {
  const slugs = slugifyTitle(query);
  const studios = detectStudios(query);
  const hubUrls = [...new Set(slugs.map((slug) => `https://www.teamskeet.com/movies/${slug}`))];
  for (const batch of [hubUrls]) {
    const results = await Promise.all(batch.map((u) => lookupTeamSkeetPage(u, query)));
    const hit = results.find((r) => r?.coverUrl);
    if (hit) return hit;
  }

  const studioUrls: string[] = [];
  const hosts = studios.length
    ? studios.map((s) => s.host).filter((h): h is string => Boolean(h))
    : STUDIO_ALIASES.map((s) => s.host).filter((h): h is string => Boolean(h));
  for (const slug of slugs) {
    for (const host of hosts) {
      studioUrls.push(`https://${host}/movies/${slug}`);
    }
  }
  const uniqueStudio = [...new Set(studioUrls)].slice(0, 10);
  const studioResults = await Promise.all(
    uniqueStudio.map((u) => lookupTeamSkeetPage(u, query)),
  );
  return studioResults.find((r) => r?.coverUrl) ?? null;
}

function thenudeFull(url: string): string {
  return url
    .trim()
    .replace(/ /g, "%20")
    .replace("/thumbs/", "/")
    .replace("/medheads/", "/");
}

function parseThenudeListing(html: string, studioName: string) {
  const items: { title: string; image: string }[] = [];
  const re =
    /src="(https:\/\/static\.thenude\.com\/admin\/covers\/[^"]+)"[^>]*alt="([^"]+)"/g;
  const re2 =
    /alt="([^"]+)"[^>]*src="(https:\/\/static\.thenude\.com\/admin\/covers\/[^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    items.push({ image: thenudeFull(m[1]), title: decodeHtml(m[2]) });
  }
  while ((m = re2.exec(html))) {
    items.push({ image: thenudeFull(m[2]), title: decodeHtml(m[1]) });
  }
  return items.map((it) => ({
    ...it,
    title: it.title
      .replace(/\s+video from .+$/i, "")
      .replace(/\s+gallery from .+$/i, "")
      .replace(new RegExp(`\\s+from ${studioName}$`, "i"), "")
      .replace(/\s+in\s+/i, " ")
      .trim(),
  }));
}

async function searchThenude(query: string): Promise<CoverResult | null> {
  const studios = detectStudios(query);
  const targets = studios
    .map((s) => s.thenude)
    .filter((x): x is string => Boolean(x));
  if (!targets.length) {
    if (/\bbrazzers\b/i.test(query)) targets.push("brazzers");
    if (/nubiles|teach sex/i.test(query)) targets.push("momsteachsex", "nubiles");
    if (/bratty/i.test(query)) targets.push("brattysis");
  }
  if (!targets.length) return null;

  for (const site of [...new Set(targets)].slice(0, 3)) {
    const html = await fetchHtml(`https://www.thenude.com/covers/${site}/`, 12000);
    if (!html) continue;
    const studioName =
      STUDIO_ALIASES.find((s) => s.thenude === site)?.name ?? site;
    const items = parseThenudeListing(html, studioName);
    const best = pickBestMatch(items, query, (it) => it.title);
    if (!best) continue;
    const coverUrl = await firstVerified([best.item.image]);
    if (!coverUrl) continue;
    return {
      coverUrl,
      title: best.item.title,
      studio: studioName,
      source: "thenude",
      performers: [],
      pageUrl: `https://www.thenude.com/covers/${site}/`,
    };
  }
  return null;
}

async function searchBrattyFamily(query: string): Promise<CoverResult | null> {
  if (!/bratty/i.test(query) && !detectStudios(query).some((s) => s.thenude === "brattysis")) {
    return null;
  }
  const html = await fetchHtml(
    `https://www.brattyfamily.com/?s=${encodeURIComponent(query)}`,
    10000,
  );
  if (!html) return null;
  const items: { title: string; image: string; pageUrl: string }[] = [];
  const re =
    /<a[^>]+href="(https:\/\/(?:www\.)?brattyfamily\.com\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const pageUrl = m[1];
    const inner = m[2];
    const title = decodeHtml(inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    const img = inner.match(
      /https:\/\/(?:www\.)?brattyfamily\.com\/wp-content\/uploads\/[^"'\s]+/i,
    );
    if (title && img) items.push({ title, image: img[0], pageUrl });
  }
  const best = pickBestMatch(items, query, (it) => it.title);
  if (!best) return null;
  const coverUrl = await firstVerified([best.item.image]);
  if (!coverUrl) return null;
  return {
    coverUrl,
    title: best.item.title,
    studio: "Bratty Sis",
    source: "brattysis",
    performers: [],
    pageUrl: best.item.pageUrl,
  };
}

export async function findCover(rawQuery: string): Promise<CoverResult> {
  const query = rawQuery.replace(/\s+/g, " ").trim();
  if (query.length < 2) return empty("invalid_query");

  try {
    const primary = await searchPorndiff(query);
    if (primary?.coverUrl) return primary;
  } catch {
    /* fall through */
  }

  try {
    const skeet = await searchTeamSkeet(query);
    if (skeet?.coverUrl) return skeet;
  } catch {
    /* fall through */
  }

  try {
    const nude = await searchThenude(query);
    if (nude?.coverUrl) return nude;
  } catch {
    /* fall through */
  }

  try {
    const bratty = await searchBrattyFamily(query);
    if (bratty?.coverUrl) return bratty;
  } catch {
    /* fall through */
  }

  return empty("not_found");
}
