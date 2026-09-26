const DEMO = "Family Vacation!!! Family Strokes";
const LANG_KEY = "scenecover:lang";
const STOP = new Set([
  "a","an","the","of","and","or","to","in","on","for","with","my","her","his",
  "she","he","is","from","by","at","as","it","this","that","video","scene",
  "porn","xxx","official","hd","com","www","watch","full","free","starring",
  "feat","featuring",
]);
const STUDIOS = [
  { keys: ["family strokes","familystrokes","family-strokes"], name: "Family Strokes", code: "fs", host: "www.familystrokes.com" },
  { keys: ["perv mom","pervmom","perv-mom"], name: "PervMom", code: "pvm", host: "www.pervmom.com" },
  { keys: ["sis loves me","sislovesme","sis-loves-me"], name: "SisLovesMe", code: "slm", host: "www.sislovesme.com" },
  { keys: ["dad crush","dadcrush","dad-crush"], name: "DadCrush", code: "dc", host: "www.dadcrush.com" },
  { keys: ["mom is horny","momishorny","mom-is-horny"], name: "MomIsHorny", code: "mih", host: "www.momishorny.com" },
  { keys: ["bratty sis","brattysis"], name: "Bratty Sis" },
  { keys: ["moms teach sex","momsteachsex"], name: "Moms Teach Sex" },
  { keys: ["nubiles porn","nubiles"], name: "Nubiles" },
  { keys: ["brazzers"], name: "Brazzers" },
  { keys: ["team skeet","teamskeet"], name: "TeamSkeet" },
];
const CODE_STUDIO = { fs: "Family Strokes", pvm: "PervMom", slm: "SisLovesMe", dc: "DadCrush", mih: "MomIsHorny" };
const COPY = {
  ar: {
    tagline: "من العنوان إلى الغلاف الرسمي",
    placeholder: "اكتب عنوان المشهد",
    search: "بحث",
    searching: "جارٍ البحث عن الغلاف…",
    demo: "تجربة: Family Vacation!!! Family Strokes",
    copy: "نسخ الرابط",
    copied: "تم النسخ",
    studio: "الاستوديو",
    source: "المصدر",
    performers: "الأداء",
    emptyTitle: "ابحث عن الغلاف الترويجي",
    emptyBody: "أدخل عنوان المشهد كما هو — بأي لغة. نُظهر الغلاف الرسمي فقط بعد التحقق من الصورة، دون اختراع روابط.",
    notFoundTitle: "لا يوجد تطابق قوي",
    notFoundBody: "لم نجد غلافاً يشارك ثلاث كلمات مفتاحية على الأقل مع العنوان. جرّب الصيغة الرسمية كما تظهر لدى الاستوديو.",
    unverifiedTitle: "تعذّر التحقق من الصورة",
    unverifiedBody: "عُثر على مرشح لكن ملف الصورة لم يُحمَّل. أعد المحاولة بعد قليل.",
    invalid: "أدخل عنواناً أطول من حرفين.",
    hint: "العناوين وأسماء المؤدين تُعرض كما هي بالحروف اللاتينية.",
    urlLabel: "رابط الصورة المباشر",
  },
  en: {
    tagline: "From title to official cover",
    placeholder: "Type any scene title",
    search: "Search",
    searching: "Finding the promotional cover…",
    demo: "Try: Family Vacation!!! Family Strokes",
    copy: "Copy URL",
    copied: "Copied",
    studio: "Studio",
    source: "Source",
    performers: "Cast",
    emptyTitle: "Find the promotional cover",
    emptyBody: "Enter the scene title as published — any language. We only show a URL after the image file is verified. No invented links.",
    notFoundTitle: "No strong match",
    notFoundBody: "Nothing shared at least three meaningful words with that title. Try the official studio wording.",
    unverifiedTitle: "Image could not be verified",
    unverifiedBody: "A candidate was found but the image file did not load. Try again shortly.",
    invalid: "Enter a title longer than two characters.",
    hint: "Film titles and performer names stay in Latin script.",
    urlLabel: "Direct image URL",
  },
};

function decodeHtml(input) {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/'/gi, "'")
    .replace(/&#0*39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function normalizeTitle(s) {
  let t = decodeHtml(s).toLowerCase();
  t = t.replace(/[’'`]/g, "");
  t = t.replace(/s(\d+)\s*[:\-.]?\s*e(\d+)/gi, " s$1 e$2 ");
  t = t.replace(/\bstep[\s-]*mom\b/g, "stepmom");
  t = t.replace(/\bstep[\s-]*daughter\b/g, "stepdaughter");
  t = t.replace(/\bstep[\s-]*sister\b/g, "stepsister");
  t = t.replace(/[^a-z0-9]+/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

function stripStudios(text) {
  let n = normalizeTitle(text);
  const keys = STUDIOS.flatMap((s) => s.keys).sort((a, b) => b.length - a.length);
  for (const key of keys) n = n.replaceAll(key, " ");
  return n.replace(/\s+/g, " ").trim();
}

function meaningfulTokens(s) {
  const seen = new Set();
  const out = [];
  for (const w of normalizeTitle(s).split(" ")) {
    if (w.length < 2 || STOP.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

function isStrongMatch(query, title, extra = "") {
  const qExact = stripStudios(query);
  const tExact = stripStudios(title);
  if (!qExact || !tExact) return { ok: false, score: 0 };
  if (qExact === tExact) return { ok: true, score: 100 };
  const qt = meaningfulTokens(qExact);
  const tt = meaningfulTokens(`${tExact} ${extra}`);
  const overlap = qt.filter((tok) => tt.includes(tok));
  const union = new Set([...qt, ...tt]);
  const jaccard = union.size ? overlap.length / union.size : 0;
  if (overlap.length >= 3) {
    return { ok: true, score: 40 + overlap.length * 8 + jaccard * 20 };
  }
  return { ok: false, score: overlap.length };
}

function slugifyTitle(title) {
  const base = stripStudios(title)
    .replace(/s(\d+)\s+e(\d+)/g, "s$1-e$2")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const variants = new Set();
  if (base) variants.add(base);
  variants.add(base.replace(/step-mom/g, "stepmom").replace(/step-daughter/g, "stepdaughter"));
  variants.add(base.replace(/stepmom/g, "step-mom").replace(/stepdaughter/g, "step-daughter"));
  return [...variants].filter(Boolean);
}

function pickBest(items, query, getTitle) {
  let best = null;
  for (const item of items) {
    const match = isStrongMatch(query, getTitle(item));
    if (!match.ok) continue;
    if (!best || match.score > best.match.score) best = { item, match };
  }
  return best;
}

function verifyImage(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith("https://")) return resolve(null);
    const img = new Image();
    const t = setTimeout(() => {
      img.onload = img.onerror = null;
      resolve(null);
    }, 8000);
    img.onload = () => {
      clearTimeout(t);
      resolve(url);
    };
    img.onerror = () => {
      clearTimeout(t);
      resolve(null);
    };
    img.src = url;
  });
}

async function firstVerified(urls) {
  const seen = new Set();
  for (const raw of urls) {
    const url = String(raw || "").replace(/\\/g, "").trim();
    if (!url.startsWith("https://") || seen.has(url)) continue;
    seen.add(url);
    const ok = await verifyImage(url);
    if (ok) return ok;
  }
  return null;
}

async function fetchHtml(url) {
  const attempts = [
    url,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];
  for (const src of attempts) {
    try {
      const res = await fetch(src, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length > 200 && /<html|og:image|card-video|poster/i.test(text)) {
        return text;
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

function parsePorndiff(html) {
  const hits = [];
  const re =
    /<a href="(https:\/\/(?:en\.)?porndiff\.com\/videos\/([^"]+))"\s+title="([^"]*)"[^>]*class="font-medium leading-5 font-title[^"]*"[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    hits.push({
      slug: m[2],
      title: decodeHtml(m[4] || m[3] || ""),
      pageUrl: m[1].replace("https://porndiff.com/", "https://en.porndiff.com/"),
    });
  }
  if (!hits.length) {
    const loose = /href="https:\/\/(?:en\.)?porndiff\.com\/videos\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    const seen = new Set();
    while ((m = loose.exec(html))) {
      if (seen.has(m[1])) continue;
      seen.add(m[1]);
      hits.push({
        slug: m[1],
        title: decodeHtml(m[2]),
        pageUrl: `https://en.porndiff.com/videos/${m[1]}`,
      });
    }
  }
  return hits;
}

function attr(html, name) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`, "i");
  return re.exec(html)?.[1] ?? re2.exec(html)?.[1] ?? null;
}

function unwrapPsm(url) {
  const cgi = url.match(/https:\/\/images\.psmcdn\.net\/cdn-cgi\/image\/[^/]+\/(teamskeet\/[^?#]+)/i);
  if (cgi?.[1]) return `https://images.psmcdn.net/${cgi[1]}`;
  return url.replace(/\/shared\/(med|low|thumb)\.jpg/i, "/shared/hi.jpg");
}

function performerFromPsm(url) {
  const m = url.match(/\/teamskeet\/[a-z]+\/([a-z0-9_]+)\//i);
  if (!m) return [];
  const slug = m[1].replace(/\d+$/, "");
  const name = slug.split("_").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return name ? [name] : [];
}

async function searchPorndiff(query) {
  const html = await fetchHtml(`https://en.porndiff.com/search/?q=${encodeURIComponent(query)}`);
  if (!html) {
    const slugs = slugifyTitle(query);
    for (const slug of slugs) {
      const url = await firstVerified([
        `https://cdn.porndiff.com/tubes/${slug}_poster_01.jpg`,
        `https://cdn.porndiff.com/tubes/${slug}.jpg`,
      ]);
      if (url && isStrongMatch(query, slug.replace(/-/g, " ")).ok) {
        return { coverUrl: url, title: query, studio: null, source: "porndiff", performers: [], pageUrl: `https://en.porndiff.com/videos/${slug}` };
      }
    }
    return null;
  }
  const hits = parsePorndiff(html);
  const best = pickBest(hits, query, (h) => h.title);
  if (!best) return null;
  const hit = best.item;
  const coverUrl = await firstVerified([
    `https://cdn.porndiff.com/tubes/${hit.slug}_poster_01.jpg`,
    `https://cdn.porndiff.com/tubes/${hit.slug}.jpg`,
  ]);
  if (!coverUrl) return { coverUrl: null, title: hit.title, studio: null, source: "porndiff", performers: [], pageUrl: hit.pageUrl, error: "unverified" };
  return { coverUrl, title: hit.title, studio: null, source: "porndiff", performers: [], pageUrl: hit.pageUrl };
}

async function searchTeamSkeet(query) {
  const slugs = slugifyTitle(query);
  const urls = slugs.map((s) => `https://www.teamskeet.com/movies/${s}`);
  for (const s of STUDIOS) {
    if (s.host) for (const slug of slugs) urls.push(`https://${s.host}/movies/${slug}`);
  }
  for (const page of [...new Set(urls)].slice(0, 8)) {
    const html = await fetchHtml(page);
    if (!html) continue;
    const title = (attr(html, "og:title") || decodeHtml((html.match(/<title>([^<]+)/i)?.[1] || "").split("|")[0])).trim();
    if (!title || !isStrongMatch(query, title).ok) continue;
    const og = attr(html, "og:image");
    const direct = html.match(/https:\/\/images\.psmcdn\.net\/(?:cdn-cgi\/image\/[^/]+\/)?teamskeet\/[a-z]+\/[a-z0-9_]+\/shared\/(?:hi|med)\.jpg/i)?.[0];
    const raw = og ? unwrapPsm(og) : direct ? unwrapPsm(direct) : null;
    if (!raw) continue;
    const hi = raw.replace(/\/shared\/(med|low)\.jpg/i, "/shared/hi.jpg");
    const coverUrl = (await verifyImage(hi)) || (await verifyImage(raw));
    if (!coverUrl) continue;
    const code = coverUrl.match(/\/teamskeet\/([a-z]+)\//i)?.[1];
    return {
      coverUrl,
      title,
      studio: code ? CODE_STUDIO[code] || null : null,
      source: "teamskeet",
      performers: performerFromPsm(coverUrl),
      pageUrl: page,
    };
  }
  return null;
}

async function findCover(rawQuery) {
  const query = rawQuery.replace(/\s+/g, " ").trim();
  if (query.length < 2) {
    return { coverUrl: null, title: null, studio: null, source: null, performers: [], pageUrl: null, error: "invalid_query" };
  }
  try {
    const res = await fetch(`/api/cover?q=${encodeURIComponent(query)}`);
    if (res.ok || res.status === 404) {
      const data = await res.json();
      if (data && (data.coverUrl || data.error)) return data;
    }
  } catch {
    /* static host — scrape client-side */
  }
  try {
    const primary = await searchPorndiff(query);
    if (primary?.coverUrl) return primary;
    if (primary?.error === "unverified") return primary;
  } catch { /* fall through */ }
  try {
    const skeet = await searchTeamSkeet(query);
    if (skeet?.coverUrl) return skeet;
  } catch { /* fall through */ }
  return { coverUrl: null, title: null, studio: null, source: null, performers: [], pageUrl: null, error: "not_found" };
}

const icon = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>',
  spin: '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  clapper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4 4 8v12h16V4Z"/><path d="m4 8 16-4"/></svg>',
};

let lang = "ar";
let lastResult = null;
let imageReady = false;

function t() {
  return COPY[lang];
}

function applyDir() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

function el(id) {
  return document.getElementById(id);
}

function renderCopy() {
  const c = t();
  el("tagline").textContent = c.tagline;
  el("scene-query").placeholder = c.placeholder;
  el("search-label").textContent = c.search;
  el("demo-label").textContent = c.demo;
  el("hint").textContent = c.hint;
  el("btn-ar").setAttribute("aria-pressed", lang === "ar" ? "true" : "false");
  el("btn-en").setAttribute("aria-pressed", lang === "en" ? "true" : "false");
  if (!lastResult && !el("main").dataset.loading) showEmpty();
}

function showEmpty() {
  const c = t();
  el("main").innerHTML = `<div class="state"><h2>${c.emptyTitle}</h2><p>${c.emptyBody}</p></div>`;
}

function showState(title, body) {
  el("main").innerHTML = `<div class="state"><h2>${title}</h2>${body ? `<p>${body}</p>` : ""}</div>`;
}

function showLoading() {
  const c = t();
  el("main").dataset.loading = "1";
  el("main").innerHTML = `
    <div class="card">
      <div class="frame">${icon.spin}</div>
      <div class="body">
        <p class="muted">${c.searching}</p>
        <div class="skel" style="width:66%;margin-top:12px"></div>
        <div class="skel" style="width:33%;margin-top:8px"></div>
      </div>
    </div>`;
}

function displaySrc(url) {
  if (!url) return "";
  return `/api/image?url=${encodeURIComponent(url)}`;
}

function showResult(data) {
  const c = t();
  lastResult = data;
  imageReady = false;
  if (!data.coverUrl) {
    if (data.error === "invalid_query") return showState(c.invalid, "");
    if (data.error === "unverified") return showState(c.unverifiedTitle, c.unverifiedBody);
    return showState(c.notFoundTitle, c.notFoundBody);
  }
  const meta = [];
  if (data.studio) meta.push(`<div><dt>${c.studio}</dt><dd>${escapeHtml(data.studio)}</dd></div>`);
  if (data.source) meta.push(`<div><dt>${c.source}</dt><dd>${escapeHtml(data.source)}</dd></div>`);
  if (data.performers?.length) {
    meta.push(`<div><dt>${c.performers}</dt><dd>${escapeHtml(data.performers.join(" · "))}</dd></div>`);
  }
  el("main").innerHTML = `
    <article class="card">
      <div class="frame">
        <img id="cover-img" alt="${escapeHtml(data.title || "")}" src="${escapeHtml(displaySrc(data.coverUrl))}">
      </div>
      <div class="body">
        <h2 class="title">${escapeHtml(data.title || "")}</h2>
        <dl class="meta">${meta.join("")}</dl>
        <p id="url-wait" class="muted">${c.searching}</p>
        <div id="url-box" class="urlbox" hidden>
          <p class="label">${c.urlLabel}</p>
          <code id="cover-url"></code>
          <button type="button" class="btn" id="copy-btn">${icon.copy}<span>${c.copy}</span></button>
        </div>
      </div>
    </article>`;
  const img = el("cover-img");
  img.onload = () => revealUrl(data.coverUrl);
  img.onerror = () => {
    img.onerror = null;
    img.src = data.coverUrl;
    img.onload = () => revealUrl(data.coverUrl);
    img.onerror = () => showState(c.unverifiedTitle, c.unverifiedBody);
  };
}

function revealUrl(url) {
  imageReady = true;
  const c = t();
  const wait = el("url-wait");
  const box = el("url-box");
  if (wait) wait.remove();
  if (!box) return;
  box.hidden = false;
  el("cover-url").textContent = url;
  el("copy-btn").onclick = async () => {
    if (!imageReady) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    el("copy-btn").innerHTML = `${icon.check}<span>${c.copied}</span>`;
    setTimeout(() => {
      if (el("copy-btn")) el("copy-btn").innerHTML = `${icon.copy}<span>${c.copy}</span>`;
    }, 1600);
  };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

async function runSearch(q) {
  showLoading();
  el("search-btn").disabled = true;
  el("demo-btn").disabled = true;
  try {
    const data = await findCover(q);
    delete el("main").dataset.loading;
    showResult(data);
  } finally {
    el("search-btn").disabled = false;
    el("demo-btn").disabled = false;
  }
}

function boot() {
  const saved = localStorage.getItem(LANG_KEY);
  lang = saved === "en" || saved === "ar" ? saved : "ar";
  applyDir();
  renderCopy();
  showEmpty();
  el("btn-ar").onclick = () => {
    lang = "ar";
    localStorage.setItem(LANG_KEY, lang);
    applyDir();
    renderCopy();
    if (lastResult) showResult(lastResult);
  };
  el("btn-en").onclick = () => {
    lang = "en";
    localStorage.setItem(LANG_KEY, lang);
    applyDir();
    renderCopy();
    if (lastResult) showResult(lastResult);
  };
  el("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    void runSearch(el("scene-query").value);
  });
  el("demo-btn").onclick = () => {
    el("scene-query").value = DEMO;
    void runSearch(DEMO);
  };
  el("search-icon").innerHTML = icon.search;
  el("demo-icon").innerHTML = icon.clapper;
}

boot();
