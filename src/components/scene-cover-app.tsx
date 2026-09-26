import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clapperboard,
  Copy,
  ImageOff,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COPY, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CoverResult } from "@/lib/cover/types";

const DEMO = "Family Vacation!!! Family Strokes";
const LANG_KEY = "scenecover:lang";

function applyDir(lang: Lang) {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
}

const SOURCE_LABEL: Record<string, { ar: string; en: string }> = {
  porndiff: { ar: "Porndiff", en: "Porndiff" },
  teamskeet: { ar: "TeamSkeet", en: "TeamSkeet" },
  thenude: { ar: "theNude", en: "theNude" },
  brattysis: { ar: "Bratty Sis", en: "Bratty Sis" },
};

export function SceneCoverApp() {
  const [lang, setLang] = useState<Lang>("ar");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverResult | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = COPY[lang];

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    const next: Lang = saved === "en" || saved === "ar" ? saved : "ar";
    setLang(next);
    applyDir(next);
  }, []);

  function switchLang(next: Lang) {
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
    applyDir(next);
  }

  const displaySrc = useMemo(() => {
    if (!result?.coverUrl) return null;
    return `/api/image?url=${encodeURIComponent(result.coverUrl)}`;
  }, [result?.coverUrl]);

  async function runSearch(raw: string) {
    const q = raw.trim();
    if (q.length < 2) {
      setResult({
        coverUrl: null,
        title: null,
        studio: null,
        source: null,
        performers: [],
        pageUrl: null,
        error: "invalid_query",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    setImageReady(false);
    setImageFailed(false);
    setCopied(false);
    try {
      const res = await fetch(`/api/cover?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as CoverResult;
      setResult(data);
    } catch {
      setResult({
        coverUrl: null,
        title: null,
        studio: null,
        source: null,
        performers: [],
        pageUrl: null,
        error: "not_found",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    if (!result?.coverUrl || !imageReady) return;
    try {
      await navigator.clipboard.writeText(result.coverUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const el = document.createElement("textarea");
      el.value = result.coverUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg text-fg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--color-fg) 0 1px, transparent 1px 3px)",
        }}
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[0.7rem] tracking-[0.22em] text-muted uppercase">
              SceneCover
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.7rem,5vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.03em] text-fg">
              {t.tagline}
            </h1>
          </div>
          <div
            className="flex h-11 shrink-0 items-center rounded-md border border-border bg-surface p-1"
            role="group"
            aria-label={t.langLabel}
          >
            <button
              type="button"
              onClick={() => switchLang("ar")}
              className={cn(
                "h-9 min-w-11 rounded-sm px-3 text-sm font-medium",
                lang === "ar"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:text-fg",
              )}
            >
              ع
            </button>
            <button
              type="button"
              onClick={() => switchLang("en")}
              className={cn(
                "h-9 min-w-11 rounded-sm px-3 text-sm font-medium",
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:text-fg",
              )}
            >
              EN
            </button>
          </div>
        </header>

        <form
          className="mt-8 rounded-xl border border-border bg-surface p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch(query);
          }}
        >
          <label className="sr-only" htmlFor="scene-query">
            {t.placeholder}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="scene-query"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="min-h-12 flex-1"
            />
            <Button type="submit" size="lg" disabled={loading} className="sm:min-w-28">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              {t.search}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto min-h-11 max-w-full whitespace-normal py-2 text-start"
              onClick={() => {
                setQuery(DEMO);
                void runSearch(DEMO);
              }}
              disabled={loading}
            >
              <Clapperboard />
              {t.demo}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-sm text-subtle">{t.hint}</p>

        <main className="mt-8 flex-1">
          {loading ? (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex aspect-[16/10] items-center justify-center bg-surface-2">
                <Loader2 className="size-8 animate-spin text-muted" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm text-muted">{t.searching}</p>
                <div className="h-4 w-2/3 rounded-sm bg-surface-2" />
                <div className="h-4 w-1/3 rounded-sm bg-surface-2" />
              </div>
            </div>
          ) : result?.coverUrl ? (
            <article className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="relative bg-surface-2">
                {displaySrc && !imageFailed ? (
                  <img
                    src={displaySrc}
                    alt={result.title ?? ""}
                    className="mx-auto max-h-[70vh] w-full object-contain"
                    onLoad={() => setImageReady(true)}
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 text-muted">
                    <ImageOff className="size-8" />
                    <p className="text-sm">{t.unverifiedTitle}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div>
                  <h2 className="font-display text-xl font-medium leading-snug tracking-[-0.02em] sm:text-2xl">
                    {result.title}
                  </h2>
                  <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                    {result.studio ? (
                      <div>
                        <dt className="text-subtle">{t.studio}</dt>
                        <dd className="text-fg">{result.studio}</dd>
                      </div>
                    ) : null}
                    {result.source ? (
                      <div>
                        <dt className="text-subtle">{t.source}</dt>
                        <dd className="text-fg">
                          {SOURCE_LABEL[result.source]?.[lang] ?? result.source}
                        </dd>
                      </div>
                    ) : null}
                    {result.performers.length ? (
                      <div className="min-w-0">
                        <dt className="text-subtle">{t.performers}</dt>
                        <dd className="text-fg">
                          {result.performers.join(" · ")}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                {imageReady && result.coverUrl ? (
                  <div className="rounded-lg bg-bg p-3">
                    <p className="text-xs text-subtle">{t.urlLabel}</p>
                    <p className="mt-1 break-all font-mono text-[0.78rem] leading-relaxed text-fg">
                      {result.coverUrl}
                    </p>
                    <Button
                      type="button"
                      className="mt-3 w-full sm:w-auto"
                      onClick={() => void copyUrl()}
                    >
                      {copied ? <Check /> : <Copy />}
                      {copied ? t.copied : t.copy}
                    </Button>
                  </div>
                ) : imageFailed ? null : (
                  <p className="text-sm text-muted">{t.searching}</p>
                )}
              </div>
            </article>
          ) : result?.error === "invalid_query" ? (
            <StateCard title={t.invalid} body="" />
          ) : result?.error === "unverified" ? (
            <StateCard title={t.unverifiedTitle} body={t.unverifiedBody} />
          ) : result?.error === "not_found" ? (
            <StateCard title={t.notFoundTitle} body={t.notFoundBody} />
          ) : (
            <StateCard title={t.emptyTitle} body={t.emptyBody} quiet />
          )}
        </main>
      </div>
    </div>
  );
}

function StateCard({
  title,
  body,
  quiet = false,
}: {
  title: string;
  body: string;
  quiet?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-10 text-center sm:px-8">
      <h2
        className={cn(
          "font-display text-xl font-medium tracking-[-0.02em]",
          quiet ? "text-fg" : "text-fg",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          {body}
        </p>
      ) : null}
    </div>
  );
}
