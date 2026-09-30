import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Copy, i as ImageOff, n as Search, o as Clapperboard, r as LoaderCircle, s as Check } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ccq6RoHh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			ghost: "text-muted hover:text-fg hover:bg-surface-2"
		},
		size: {
			default: "h-11 rounded-md px-5 text-sm",
			lg: "h-12 rounded-md px-6 text-sm",
			sm: "h-9 rounded-sm px-3 text-xs",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type = "text", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-12 w-full rounded-md border border-border bg-surface px-4 text-base text-fg shadow-none transition-[border-color,box-shadow] duration-[var(--motion-quick)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var COPY = {
	ar: {
		name: "SceneCover",
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
		langLabel: "اللغة",
		urlLabel: "رابط الصورة المباشر"
	},
	en: {
		name: "SceneCover",
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
		langLabel: "Language",
		urlLabel: "Direct image URL"
	}
};
var DEMO = "Family Vacation!!! Family Strokes";
var LANG_KEY = "scenecover:lang";
function applyDir(lang) {
	const root = document.documentElement;
	root.lang = lang;
	root.dir = lang === "ar" ? "rtl" : "ltr";
}
var SOURCE_LABEL = {
	porndiff: {
		ar: "Porndiff",
		en: "Porndiff"
	},
	teamskeet: {
		ar: "TeamSkeet",
		en: "TeamSkeet"
	},
	thenude: {
		ar: "theNude",
		en: "theNude"
	},
	brattysis: {
		ar: "Bratty Sis",
		en: "Bratty Sis"
	}
};
function SceneCoverApp() {
	const [lang, setLang] = (0, import_react.useState)("ar");
	const [query, setQuery] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [imageReady, setImageReady] = (0, import_react.useState)(false);
	const [imageFailed, setImageFailed] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const t = COPY[lang];
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(LANG_KEY);
		const next = saved === "en" || saved === "ar" ? saved : "ar";
		setLang(next);
		applyDir(next);
	}, []);
	function switchLang(next) {
		setLang(next);
		localStorage.setItem(LANG_KEY, next);
		applyDir(next);
	}
	const displaySrc = (0, import_react.useMemo)(() => {
		if (!result?.coverUrl) return null;
		return `/api/image?url=${encodeURIComponent(result.coverUrl)}`;
	}, [result?.coverUrl]);
	async function runSearch(raw) {
		const q = raw.trim();
		if (q.length < 2) {
			setResult({
				coverUrl: null,
				title: null,
				studio: null,
				source: null,
				performers: [],
				pageUrl: null,
				error: "invalid_query"
			});
			return;
		}
		setLoading(true);
		setResult(null);
		setImageReady(false);
		setImageFailed(false);
		setCopied(false);
		try {
			const data = await (await fetch(`/api/cover?q=${encodeURIComponent(q)}`)).json();
			setResult(data);
		} catch {
			setResult({
				coverUrl: null,
				title: null,
				studio: null,
				source: null,
				performers: [],
				pageUrl: null,
				error: "not_found"
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-x-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 opacity-[0.035]",
			style: { backgroundImage: "repeating-linear-gradient(0deg, var(--color-fg) 0 1px, transparent 1px 3px)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[0.7rem] tracking-[0.22em] text-muted uppercase",
						children: "SceneCover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-[clamp(1.7rem,5vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.03em] text-fg",
						children: t.tagline
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-11 shrink-0 items-center rounded-md border border-border bg-surface p-1",
						role: "group",
						"aria-label": t.langLabel,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => switchLang("ar"),
							className: cn("h-9 min-w-11 rounded-sm px-3 text-sm font-medium", lang === "ar" ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg"),
							children: "ع"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => switchLang("en"),
							className: cn("h-9 min-w-11 rounded-sm px-3 text-sm font-medium", lang === "en" ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg"),
							children: "EN"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 rounded-xl border border-border bg-surface p-3 sm:p-4",
					onSubmit: (e) => {
						e.preventDefault();
						runSearch(query);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "scene-query",
							children: t.placeholder
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "scene-query",
								ref: inputRef,
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: t.placeholder,
								autoComplete: "off",
								spellCheck: false,
								className: "min-h-12 flex-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "lg",
								disabled: loading,
								className: "sm:min-w-28",
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {}), t.search]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "h-auto min-h-11 max-w-full whitespace-normal py-2 text-start",
								onClick: () => {
									setQuery(DEMO);
									runSearch(DEMO);
								},
								disabled: loading,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {}), t.demo]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-subtle",
					children: t.hint
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mt-8 flex-1",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border border-border bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-[16/10] items-center justify-center bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: t.searching
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-2/3 rounded-sm bg-surface-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1/3 rounded-sm bg-surface-2" })
							]
						})]
					}) : result?.coverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-xl border border-border bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative bg-surface-2",
							children: displaySrc && !imageFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: displaySrc,
								alt: result.title ?? "",
								className: "mx-auto max-h-[70vh] w-full object-contain",
								onLoad: () => setImageReady(true),
								onError: () => setImageFailed(true)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex aspect-[16/10] flex-col items-center justify-center gap-2 text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: t.unverifiedTitle
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 p-5 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-medium leading-snug tracking-[-0.02em] sm:text-2xl",
								children: result.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted",
								children: [
									result.studio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: t.studio
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-fg",
										children: result.studio
									})] }) : null,
									result.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-subtle",
										children: t.source
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-fg",
										children: SOURCE_LABEL[result.source]?.[lang] ?? result.source
									})] }) : null,
									result.performers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-subtle",
											children: t.performers
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-fg",
											children: result.performers.join(" · ")
										})]
									}) : null
								]
							})] }), imageReady && result.coverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-bg p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-subtle",
										children: t.urlLabel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 break-all font-mono text-[0.78rem] leading-relaxed text-fg",
										children: result.coverUrl
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										className: "mt-3 w-full sm:w-auto",
										onClick: () => void copyUrl(),
										children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? t.copied : t.copy]
									})
								]
							}) : imageFailed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: t.searching
							})]
						})]
					}) : result?.error === "invalid_query" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateCard, {
						title: t.invalid,
						body: ""
					}) : result?.error === "unverified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateCard, {
						title: t.unverifiedTitle,
						body: t.unverifiedBody
					}) : result?.error === "not_found" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateCard, {
						title: t.notFoundTitle,
						body: t.notFoundBody
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateCard, {
						title: t.emptyTitle,
						body: t.emptyBody,
						quiet: true
					})
				})
			]
		})]
	});
}
function StateCard({ title, body, quiet = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface px-5 py-10 text-center sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: cn("font-display text-xl font-medium tracking-[-0.02em]", quiet ? "text-fg" : "text-fg"),
			children: title
		}), body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted",
			children: body
		}) : null]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneCoverApp, {});
}
//#endregion
export { Home as component };
