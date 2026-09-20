#!/usr/bin/env python3
"""أصل (Asl) — General official-cover finder (local server only)"""
import json, os, re, ssl
from concurrent.futures import ThreadPoolExecutor, as_completed
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote
from urllib.request import Request, urlopen

try:
    import requests
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
TIMEOUT = 10

def normalize_query(q):
    return re.sub(r"\s+", " ", unquote(q).strip())

def clean_title(q):
    t = q.lower()
    t = re.sub(r"\bs\d{1,2}\s*[:\-]?\s*e\d{1,2}\b", " ", t, flags=re.I)
    t = re.sub(r"\b(season|episode|ep)\s*\d+\b", " ", t, flags=re.I)
    for s in ["family strokes","familystrokes","bratty sis","brattysis","moms teach sex","momsteachsex","sis loves me","sislovesme","dad crush","dadcrush","pervmom","perv mom","nubile films","nubiles","teamskeet","team skeet","momishorny","mom is horny","bangbros","bang bros"]:
        t = t.replace(s, " ")
    t = re.sub(r"[!?.¡¿]+", " ", t)
    t = re.sub(r"[^\w\s\-']", " ", t, flags=re.U)
    return re.sub(r"\s+", " ", t).strip(" -_")

def slug_underscore(title):
    s = re.sub(r"[^a-z0-9\s]", "", title.lower())
    return re.sub(r"\s+", "_", s.strip())

def slug_hyphen(title):
    s = re.sub(r"[^a-z0-9\s]", "", title.lower())
    return re.sub(r"\s+", "-", s.strip())

def detect_studio(q):
    ql = q.lower()
    found = []
    mapping = [("family strokes","fs"),("familystrokes","fs"),("bratty sis","bratty"),("brattysis","bratty"),("moms teach sex","mts"),("momsteachsex","mts"),("sis loves me","slm"),("sislovesme","slm"),("dad crush","dc"),("dadcrush","dc"),("pervmom","pvm"),("perv mom","pvm"),("momishorny","mih"),("mom is horny","mih"),("nubile","nubiles"),("nubiles","nubiles"),("teamskeet","ts"),("bangbros","bb"),("bang bros","bb")]
    for key, code in mapping:
        if key in ql: found.append(code)
    if not found and any(w in ql for w in ("stepson","stepsis","stepsister","stepbrother","stepmom","stepdad")):
        found.extend(["fs","bratty","mts","slm","dc","pvm"])
    return list(dict.fromkeys(found))

def score_cover(url):
    if not url: return -999
    u = url.lower(); score = 0
    if "/admin/covers/" in u and "/thumbs/" not in u: score += 28
    if "samples/cover1280.jpg" in u and not re.search(r"cover1280-\d", u): score += 24
    if "brattyfamily.com/wp-content/uploads" in u: score += 22
    if "images.psmcdn.net" in u and "/shared/hi.jpg" in u: score += 22
    if "images.psmcdn.net" in u and "/shared/med.jpg" in u: score += 18
    if "wp-content/uploads" in u and u.endswith((".jpg",".jpeg",".png",".webp")): score += 15
    if re.search(r"[a-z0-9\-_]+\.(jpg|jpeg|png|webp)(\?|$)", u): score += 5
    if re.search(r"cover1280-\d", u): score -= 80
    if any(x in u for x in ["/photos/","/gallery/","/tn/","/stills/","babehub","/thumbs/","/preview/"]): score -= 80
    if any(x in u for x in ["favicon","logo","sprite","avatar","starthumb","icon"]): score -= 100
    return score

def is_image_bytes(url):
    try:
        req = Request(url, headers={"User-Agent": UA}, method="HEAD")
        ctx = ssl.create_default_context()
        with urlopen(req, timeout=8, context=ctx) as resp:
            ct = (resp.headers.get("Content-Type") or "").lower()
            return resp.status == 200 and ct.startswith("image/")
    except Exception:
        try:
            req = Request(url, headers={"User-Agent": UA})
            ctx = ssl.create_default_context()
            with urlopen(req, timeout=8, context=ctx) as resp:
                ct = (resp.headers.get("Content-Type") or "").lower()
                if not ct.startswith("image/"): return False
                chunk = resp.read(32)
                return chunk.startswith(b"\xff\xd8") or chunk.startswith(b"\x89PNG") or b"WEBP" in chunk[:16] or chunk.startswith(b"GIF")
        except Exception:
            return False

IMAGE_HOSTS = {
    "iili.io", "images.psmcdn.net", "images.nubiles-porn.com",
    "brattyfamily.com", "www.brattyfamily.com", "familystrokes.com",
    "www.familystrokes.com", "momsteachsex.com", "www.momsteachsex.com",
    "teamskeet.com", "www.teamskeet.com", "sislovesme.com",
    "www.sislovesme.com", "dadcrush.com", "www.dadcrush.com",
    "pervmom.com", "www.pervmom.com", "momishorny.com", "www.momishorny.com",
    "nubilefilms.com", "www.nubilefilms.com", "nubiles-porn.com",
}
MAX_IMAGE_BYTES = 8 * 1024 * 1024

def fetch_image(url):
    """Fetch an allow-listed remote image so the browser does not need hotlink access."""
    parsed = urlparse(url)
    if parsed.scheme != "https" or (parsed.hostname or "").lower() not in IMAGE_HOSTS:
        return None, "image host is not allow-listed"
    try:
        req = Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8"})
        ctx = ssl.create_default_context()
        with urlopen(req, timeout=12, context=ctx) as resp:
            content_type = (resp.headers.get("Content-Type") or "").split(";", 1)[0].lower()
            if not content_type.startswith("image/"):
                return None, "remote response is not an image"
            length = int(resp.headers.get("Content-Length") or 0)
            if length > MAX_IMAGE_BYTES:
                return None, "image is too large"
            body = resp.read(MAX_IMAGE_BYTES + 1)
            if len(body) > MAX_IMAGE_BYTES:
                return None, "image is too large"
            if not (body.startswith(b"\xff\xd8") or body.startswith(b"\x89PNG") or b"WEBP" in body[:32] or body.startswith(b"GIF")):
                return None, "image bytes could not be verified"
            return (body, content_type), None
    except Exception as exc:
        return None, str(exc)

def fetch_page(url):
    try:
        if HAS_BS4:
            r = requests.get(url, headers={"User-Agent": UA}, timeout=TIMEOUT, allow_redirects=True)
            if r.status_code == 200: return r.text, r.url
        else:
            req = Request(url, headers={"User-Agent": UA})
            ctx = ssl.create_default_context()
            with urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
                return resp.read().decode("utf-8", errors="ignore"), resp.geturl()
    except Exception:
        pass
    return None, url

def extract_og_and_meta(html):
    out = {"og_image": None, "title": None, "description": None}
    if not html: return out
    if HAS_BS4:
        soup = BeautifulSoup(html, "html.parser")
        og = soup.find("meta", property="og:image") or soup.find("meta", attrs={"property": "og:image"})
        if og and og.get("content"): out["og_image"] = og["content"].strip()
        tw = soup.find("meta", attrs={"name": "twitter:image"})
        if not out["og_image"] and tw and tw.get("content"): out["og_image"] = tw["content"].strip()
        if soup.title and soup.title.string: out["title"] = soup.title.string.strip()
        desc = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", property="og:description")
        if desc and desc.get("content"): out["description"] = desc["content"].strip()
    else:
        m = re.search(r'property=["\']og:image["\'][^>]+content=["\']([^"\']+)', html, re.I)
        if not m: m = re.search(r'content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.I)
        if m: out["og_image"] = m.group(1).strip()
        m = re.search(r"<title[^>]*>([^<]+)</title>", html, re.I)
        if m: out["title"] = m.group(1).strip()
    return out

def candidate_official_pages(title, studios):
    h, u = slug_hyphen(title), slug_underscore(title)
    pages = []
    if not studios or "bratty" in studios or "nubiles" in studios or "mts" in studios:
        pages += [f"https://brattyfamily.com/{h}/", f"https://brattyfamily.com/{u.replace('_','-')}/"]
    if not studios or "fs" in studios or "ts" in studios:
        pages += [f"https://www.familystrokes.com/movies/{h}", f"https://www.familystrokes.com/movies/{u.replace('_','-')}", f"https://www.teamskeet.com/movies/{h}"]
    if not studios or "slm" in studios: pages.append(f"https://www.sislovesme.com/movies/{h}")
    if not studios or "dc" in studios: pages.append(f"https://www.dadcrush.com/movies/{h}")
    if not studios or "pvm" in studios: pages.append(f"https://www.pervmom.com/movies/{h}")
    if not studios or "mts" in studios or "nubiles" in studios:
        pages += [f"https://momsteachsex.com/movies/{h}", f"https://momsteachsex.com/movies/{u.replace('_','-')}", f"https://nubilefilms.com/video/{h}", f"https://nubilefilms.com/video/{u}", f"https://brattysis.com/movies/{h}", f"https://brattysis.com/{h}/", f"https://nubiles-porn.com/video/{h}"]
    pages.append(f"https://www.teamskeet.com/movies/{h}")
    return list(dict.fromkeys(pages))

def candidate_cdn_urls(title, studios, performers=None):
    h, u = slug_hyphen(title), slug_underscore(title)
    urls = []
    if not studios or any(s in studios for s in ("bratty","mts","nubiles")):
        for slug in (u, h.replace("-","_"), h):
            urls.append(f"https://images.nubiles-porn.com/videos/{slug}/samples/cover1280.jpg")
    site_codes = []
    if not studios: site_codes = ["fs","slm","dc","pvm","mih","ts"]
    else:
        for s in studios:
            if s in ("fs","slm","dc","pvm","mih","ts"): site_codes.append(s)
        if not site_codes: site_codes = ["fs","ts"]
    known_performers = {"family vacation": ["rhaya_shyne"]}
    perf_slugs = known_performers.get(title.lower(), []) + [p.lower().replace(" ", "_") for p in (performers or [])[:3]]
    for code in site_codes:
        for ps in (perf_slugs or [u]):
            urls.append(f"https://images.psmcdn.net/teamskeet/{code}/{ps}/shared/hi.jpg")
            urls.append(f"https://images.psmcdn.net/teamskeet/{code}/{ps}/shared/med.jpg")
    return list(dict.fromkeys(urls))

def identify(query):
    q = normalize_query(query)
    result = {"studio":None,"series":None,"officialSite":None,"originalTitle":None,"episodeCode":None,"releaseDate":None,"performers":[],"categories":[],"officialSummary":None,"duration":None,"officialUrl":None,"confidence":"low","notes":"","coverUrl":None,"coverScore":0,"sourcesTried":[],"coverVerified":False}
    if not q:
        result["notes"] = "Empty query"; return result
    if q.startswith("http://") or q.startswith("https://"):
        html, final = fetch_page(q)
        meta = extract_og_and_meta(html or "")
        result["officialUrl"] = final
        if meta.get("title"): result["originalTitle"] = re.sub(r"\s*[\|\-–].*$", "", meta["title"]).strip()
        if meta.get("description"): result["officialSummary"] = meta["description"][:500]
        if meta.get("og_image"):
            sc = score_cover(meta["og_image"])
            result["sourcesTried"].append({"url": meta["og_image"], "score": sc, "via": "og:image from input URL"})
            if sc >= 12 and is_image_bytes(meta["og_image"]):
                result.update({"coverUrl": meta["og_image"], "coverScore": sc, "coverVerified": True, "confidence": "high", "notes": "Cover extracted from provided page og:image"})
                return result
    title = clean_title(q) or q
    result["originalTitle"] = title.title() if title.islower() else title
    studios = detect_studio(q)
    if studios:
        names = {"fs":"Family Strokes","bratty":"Bratty Sis","mts":"Moms Teach Sex","slm":"Sis Loves Me","dc":"DadCrush","pvm":"PervMom","mih":"MomIsHorny","nubiles":"Nubiles","ts":"TeamSkeet","bb":"BangBros"}
        result["studio"] = names.get(studios[0], studios[0]); result["series"] = result["studio"]
    pages = candidate_official_pages(title, studios)
    best_page_meta = best_page_url = None
    def check_page(url):
        html, final = fetch_page(url)
        if not html: return None
        meta = extract_og_and_meta(html)
        low = html.lower()
        if "join now" in low and "members" in low and not meta.get("og_image"): return None
        if meta.get("og_image") or (meta.get("title") and title.lower()[:8] in (meta.get("title") or "").lower()):
            return {"url": final, "meta": meta}
        return None
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(check_page, p): p for p in pages[:12]}
        for fut in as_completed(futs):
            try: data = fut.result()
            except Exception: data = None
            if not data: continue
            og = data["meta"].get("og_image")
            if og:
                sc = score_cover(og)
                result["sourcesTried"].append({"url": og, "score": sc, "via": f"og from {data['url']}"})
                if sc > result["coverScore"] and sc >= 12 and is_image_bytes(og):
                    result.update({"coverUrl": og, "coverScore": sc, "coverVerified": True, "officialUrl": data["url"]})
                    best_page_meta, best_page_url = data["meta"], data["url"]
                    if sc >= 20: break
    if best_page_meta:
        if best_page_meta.get("title"):
            t = re.sub(r"\s*[\|\-–].*$", "", best_page_meta["title"]).strip()
            if len(t) > 3: result["originalTitle"] = t
        if best_page_meta.get("description"): result["officialSummary"] = best_page_meta["description"][:600]
        result["confidence"] = "high" if result["coverScore"] >= 18 else "medium"
        result["notes"] = f"Official page found → promotional cover extracted ({best_page_url})"
    if result["coverScore"] < 20:
        cdn_list = candidate_cdn_urls(title, studios, result.get("performers"))
        def check_cdn(url):
            sc = score_cover(url)
            if sc < 12: return None
            if is_image_bytes(url): return url, sc
            return None
        with ThreadPoolExecutor(max_workers=8) as ex:
            futs = {ex.submit(check_cdn, u): u for u in cdn_list[:20]}
            for fut in as_completed(futs):
                try: res = fut.result()
                except Exception: res = None
                if not res: continue
                url, sc = res
                result["sourcesTried"].append({"url": url, "score": sc, "via": "CDN pattern"})
                if sc > result["coverScore"]:
                    result.update({"coverUrl": url, "coverScore": sc, "coverVerified": True})
                    if result["confidence"] == "low": result["confidence"] = "medium"
                    if not result["notes"]: result["notes"] = "Cover found via studio CDN pattern"
                    if sc >= 22: break
    if not result["coverUrl"]:
        result["confidence"] = "low"
        result["notes"] = "No promotional cover found. Tried official studio pages and CDN patterns. Tip: include studio name or paste official scene URL."
    elif result["coverScore"] >= 18: result["confidence"] = "high"
    elif result["coverScore"] >= 12: result["confidence"] = "medium"
    result["sourcesTried"] = result["sourcesTried"][:15]
    return result

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {args[0] if args else fmt}")
    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    def do_GET(self):
        if self.path.startswith("/api/search"):
            qs = parse_qs(urlparse(self.path).query)
            q = qs.get("q", [""])[0]
            if not q: self.send_json({"error": "missing q"}, 400); return
            try: self.send_json(identify(q))
            except Exception as e:
                import traceback; traceback.print_exc()
                self.send_json({"error": str(e), "confidence": "low"}, 500)
            return
        if self.path.startswith("/api/image"):
            qs = parse_qs(urlparse(self.path).query)
            target = qs.get("url", [""])[0]
            if not target:
                self.send_json({"error": "missing url"}, 400); return
            result, error = fetch_image(target)
            if error:
                self.send_json({"error": error}, 502); return
            body, content_type = result
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Cache-Control", "public, max-age=86400")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        path = self.path.split("?")[0]
        if path in ("/", "/index.html"): path = "/index.html"
        file_path = "static" + path
        try:
            with open(file_path, "rb") as f: data = f.read()
            ctype = "text/html; charset=utf-8"
            if path.endswith(".js"): ctype = "application/javascript"
            elif path.endswith(".css"): ctype = "text/css"
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except FileNotFoundError:
            self.send_response(404); self.end_headers(); self.wfile.write(b"Not found")
    def do_POST(self):
        if self.path == "/api/search":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try: q = json.loads(body.decode("utf-8")).get("q", "")
            except Exception: q = ""
            if not q: self.send_json({"error": "missing q"}, 400); return
            try: self.send_json(identify(q))
            except Exception as e: self.send_json({"error": str(e)}, 500)
            return
        self.send_response(404); self.end_headers()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8765"))
    print(f"أصل (Asl) general engine on http://0.0.0.0:{port}")

HTTPServer(("0.0.0.0", port), Handler).serve_forever()
