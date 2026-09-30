const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export const FETCH_HEADERS: Record<string, string> = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const IMAGE_HOSTS = new Set([
  "cdn.porndiff.com",
  "en.porndiff.com",
  "porndiff.com",
  "images.psmcdn.net",
  "static.thenude.com",
  "www.thenude.com",
  "brattyfamily.com",
  "www.brattyfamily.com",
]);

export function isAllowedImageUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    if (!IMAGE_HOSTS.has(u.hostname)) return false;
    return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(u.pathname) || u.hostname.includes("psmcdn") || u.pathname.includes("/tubes/") || u.pathname.includes("/covers/");
  } catch {
    return false;
  }
}

function isImageMagic(buf: Uint8Array): boolean {
  if (buf.length < 4) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true;
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf.length >= 12 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return true;
  }
  return false;
}

export async function fetchHtml(url: string, timeoutMs = 12000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct && !ct.includes("html") && !ct.includes("xml") && !ct.includes("text/")) {
      return null;
    }
    return await res.text();
  } catch {
    return null;
  }
}

export async function verifyImage(url: string): Promise<string | null> {
  if (!isAllowedImageUrl(url)) return null;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...FETCH_HEADERS,
        Accept: "image/jpeg,image/png,image/webp,image/*;q=0.8,*/*;q=0.5",
        Range: "bytes=0-63",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok && res.status !== 206) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (!isImageMagic(buf)) return null;
    return url;
  } catch {
    return null;
  }
}

export function unwrapPsmcdn(url: string): string {
  const cgi = url.match(
    /https:\/\/images\.psmcdn\.net\/cdn-cgi\/image\/[^/]+\/(teamskeet\/[^?#]+)/i,
  );
  if (cgi?.[1]) return `https://images.psmcdn.net/${cgi[1]}`;
  return url;
}

export function preferHiJpg(url: string): string {
  const clean = unwrapPsmcdn(url).replace(/\/shared\/(med|low|thumb)\.jpg/i, "/shared/hi.jpg");
  return clean;
}

export function toCdnPorndiff(url: string): string {
  return url.replace("https://en.porndiff.com/tubes/", "https://cdn.porndiff.com/tubes/");
}

export function attr(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`,
    "i",
  );
  return re.exec(html)?.[1] ?? re2.exec(html)?.[1] ?? null;
}
