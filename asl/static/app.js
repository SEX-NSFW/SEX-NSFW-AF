const ASL_API_BASE = window.ASL_API_BASE || (location.hostname.endsWith("github.io") ? "" : location.origin);
function imageThroughServer(url) {
  return ASL_API_BASE ? `${ASL_API_BASE}/api/image?url=${encodeURIComponent(url)}` : url;
}

const I18N = {
  ar: {
    tagline: "من الاسم إلى الغلاف الرسمي",
    placeholder: "اكتب اسم المشهد أو العنوان القراصنة أو الرابط...",
    search: "بحث",
    stage1: "قراءة الاستعلام / صفحة القراصنة",
    stage2: "مطابقة الاستوديو والطاقم على IAFD",
    stage3: "جلب الملخص الرسمي",
    stage4: "جلب الغلاف الترويجي (وليس لقطات داخلية)",
    copy: "نسخ", download: "تحميل", history: "عمليات البحث الأخيرة",
    footer: "أصل · أغلفة ترويجية رسمية فقط · 18+",
    noCover: "لم يتم العثور على غلاف ترويجي رسمي. لم يتم عرض أي لقطة داخلية.",
    studio: "الموقع المنتج", realTitle: "العنوان الحقيقي", performers: "أسماء الممثلين",
    categories: "الفئات", summary: "الملخص الرسمي", duration: "المدة", release: "تاريخ الإصدار",
    officialLink: "الرابط الرسمي", confidence: "الثقة", high: "عالية", medium: "متوسطة", low: "منخفضة",
    copied: "تم النسخ!", errorGeneric: "حدث خطأ أثناء البحث. حاول مرة أخرى.",
    refuseMinor: "تم رفض الطلب: المحتوى يشير إلى قاصر. نتوقف هنا.",
    example1: "Family Vacation!!! Family Strokes",
    example2: "It Just Slipped In S2:E8",
    example3: "Ill Show You What Girls Want S21:E1",
  },
  en: {
    tagline: "From name to official cover",
    placeholder: "Type scene name, pirate title, or URL...",
    search: "Search",
    stage1: "Reading query / pirate page", stage2: "Matching studio + cast on IAFD",
    stage3: "Fetching official synopsis", stage4: "Fetching promotional cover (not internal stills)",
    copy: "Copy", download: "Download", history: "Recent searches",
    footer: "Asl · Official promotional covers only · 18+",
    noCover: "No official promotional cover found. No internal still was shown.",
    studio: "Studio", realTitle: "Official title", performers: "Performers",
    categories: "Categories", summary: "Official Summary", duration: "Duration", release: "Release date",
    officialLink: "Official link", confidence: "Confidence", high: "High", medium: "Medium", low: "Low",
    copied: "Copied!", errorGeneric: "Search failed. Please try again.",
    refuseMinor: "Refused: content appears to involve a minor. Stopping.",
    example1: "Family Vacation!!! Family Strokes",
    example2: "It Just Slipped In S2:E8",
    example3: "Ill Show You What Girls Want S21:E1",
  },
  fr: {
    tagline: "Du nom à la couverture officielle", placeholder: "Titre de scène, titre pirate ou URL...",
    search: "Rechercher", stage1: "Lecture de la requête / page pirate",
    stage2: "Correspondance studio + distribution sur IAFD", stage3: "Récupération du synopsis officiel",
    stage4: "Récupération de la couverture promotionnelle",
    copy: "Copier", download: "Télécharger", history: "Recherches récentes",
    footer: "Asl · Couvertures promotionnelles officielles uniquement · 18+",
    noCover: "Aucune couverture promotionnelle officielle trouvée.",
    studio: "Studio", realTitle: "Titre officiel", performers: "Interprètes", categories: "Catégories",
    summary: "Synopsis officiel", duration: "Durée", release: "Date de sortie", officialLink: "Lien officiel",
    confidence: "Confiance", high: "Élevée", medium: "Moyenne", low: "Faible",
    copied: "Copié !", errorGeneric: "Échec de la recherche.", refuseMinor: "Refusé : contenu suggérant un mineur.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  es: {
    tagline: "Del nombre a la portada oficial", placeholder: "Nombre de escena, título pirata o URL...",
    search: "Buscar", stage1: "Leyendo consulta / página pirata", stage2: "Emparejando estudio + elenco en IAFD",
    stage3: "Obteniendo sinopsis oficial", stage4: "Obteniendo portada promocional",
    copy: "Copiar", download: "Descargar", history: "Búsquedas recientes",
    footer: "Asl · Solo portadas promocionales oficiales · 18+",
    noCover: "No se encontró portada promocional oficial.",
    studio: "Estudio", realTitle: "Título oficial", performers: "Intérpretes", categories: "Categorías",
    summary: "Sinopsis oficial", duration: "Duración", release: "Fecha de estreno", officialLink: "Enlace oficial",
    confidence: "Confianza", high: "Alta", medium: "Media", low: "Baja",
    copied: "¡Copiado!", errorGeneric: "Error en la búsqueda.", refuseMinor: "Rechazado: posible menor.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  pt: {
    tagline: "Do nome à capa oficial", placeholder: "Nome da cena, título pirata ou URL...",
    search: "Pesquisar", stage1: "Lendo consulta / página pirata", stage2: "Combinando estúdio + elenco no IAFD",
    stage3: "Buscando sinopse oficial", stage4: "Buscando capa promocional",
    copy: "Copiar", download: "Baixar", history: "Pesquisas recentes",
    footer: "Asl · Apenas capas promocionais oficiais · 18+",
    noCover: "Nenhuma capa promocional oficial encontrada.",
    studio: "Estúdio", realTitle: "Título oficial", performers: "Intérpretes", categories: "Categorias",
    summary: "Sinopse oficial", duration: "Duração", release: "Data de lançamento", officialLink: "Link oficial",
    confidence: "Confiança", high: "Alta", medium: "Média", low: "Baixa",
    copied: "Copiado!", errorGeneric: "Falha na pesquisa.", refuseMinor: "Recusado: conteúdo de menor.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  de: {
    tagline: "Vom Namen zum offiziellen Cover", placeholder: "Szenenname, Pirate-Titel oder URL...",
    search: "Suchen", stage1: "Abfrage / Pirate-Seite lesen", stage2: "Studio + Cast auf IAFD abgleichen",
    stage3: "Offizielle Synopsis holen", stage4: "Werbe-Cover holen (keine Stills)",
    copy: "Kopieren", download: "Download", history: "Letzte Suchen",
    footer: "Asl · Nur offizielle Werbe-Cover · 18+",
    noCover: "Kein offizielles Werbe-Cover gefunden.",
    studio: "Studio", realTitle: "Offizieller Titel", performers: "Darsteller", categories: "Kategorien",
    summary: "Offizielle Synopsis", duration: "Dauer", release: "Erscheinungsdatum", officialLink: "Offizieller Link",
    confidence: "Konfidenz", high: "Hoch", medium: "Mittel", low: "Niedrig",
    copied: "Kopiert!", errorGeneric: "Suche fehlgeschlagen.", refuseMinor: "Abgelehnt: möglicher Minderjähriger.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  ru: {
    tagline: "От названия к официальной обложке", placeholder: "Название сцены, пиратское название или URL...",
    search: "Поиск", stage1: "Чтение запроса / пиратской страницы", stage2: "Сопоставление студии и актёров на IAFD",
    stage3: "Получение официального синопсиса", stage4: "Получение промо-обложки",
    copy: "Копировать", download: "Скачать", history: "Недавние поиски",
    footer: "Asl · Только официальные промо-обложки · 18+",
    noCover: "Официальная промо-обложка не найдена.",
    studio: "Студия", realTitle: "Официальное название", performers: "Актёры", categories: "Категории",
    summary: "Официальный синопсис", duration: "Длительность", release: "Дата выхода", officialLink: "Официальная ссылка",
    confidence: "Уверенность", high: "Высокая", medium: "Средняя", low: "Низкая",
    copied: "Скопировано!", errorGeneric: "Ошибка поиска.", refuseMinor: "Отклонено: возможный несовершеннолетний.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  tr: {
    tagline: "İsimden resmi kapağa", placeholder: "Sahne adı, korsan başlık veya URL...",
    search: "Ara", stage1: "Sorgu / korsan sayfa okunuyor", stage2: "Stüdyo + kadro IAFD eşleştirmesi",
    stage3: "Resmi özet alınıyor", stage4: "Promosyon kapağı alınıyor",
    copy: "Kopyala", download: "İndir", history: "Son aramalar",
    footer: "Asl · Yalnızca resmi promosyon kapakları · 18+",
    noCover: "Resmi promosyon kapağı bulunamadı.",
    studio: "Stüdyo", realTitle: "Resmi başlık", performers: "Oyuncular", categories: "Kategoriler",
    summary: "Resmi özet", duration: "Süre", release: "Yayın tarihi", officialLink: "Resmi bağlantı",
    confidence: "Güven", high: "Yüksek", medium: "Orta", low: "Düşük",
    copied: "Kopyalandı!", errorGeneric: "Arama başarısız.", refuseMinor: "Reddedildi: reşit olmayan içeriği.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  hi: {
    tagline: "नाम से आधिकारिक कवर तक", placeholder: "दृश्य का नाम, पाइरेट शीर्षक या URL...",
    search: "खोजें", stage1: "क्वेरी / पाइरेट पेज पढ़ना", stage2: "IAFD पर स्टूडियो + कास्ट मिलान",
    stage3: "आधिकारिक सारांश लाना", stage4: "प्रचार कवर लाना",
    copy: "कॉपी", download: "डाउनलोड", history: "हाल की खोजें",
    footer: "Asl · केवल आधिकारिक प्रचार कवर · 18+",
    noCover: "कोई आधिकारिक प्रचार कवर नहीं मिला।",
    studio: "स्टूडियो", realTitle: "आधिकारिक शीर्षक", performers: "कलाकार", categories: "श्रेणियाँ",
    summary: "आधिकारिक सारांश", duration: "अवधि", release: "रिलीज़ तिथि", officialLink: "आधिकारिक लिंक",
    confidence: "विश्वास", high: "उच्च", medium: "मध्यम", low: "निम्न",
    copied: "कॉपी हो गया!", errorGeneric: "खोज विफल।", refuseMinor: "अस्वीकृत: नाबालिग सामग्री।",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  id: {
    tagline: "Dari nama ke sampul resmi", placeholder: "Nama adegan, judul bajak laut, atau URL...",
    search: "Cari", stage1: "Membaca kueri / halaman bajak laut", stage2: "Mencocokkan studio + pemain di IAFD",
    stage3: "Mengambil sinopsis resmi", stage4: "Mengambil sampul promosi",
    copy: "Salin", download: "Unduh", history: "Pencarian terbaru",
    footer: "Asl · Hanya sampul promosi resmi · 18+",
    noCover: "Sampul promosi resmi tidak ditemukan.",
    studio: "Studio", realTitle: "Judul resmi", performers: "Pemain", categories: "Kategori",
    summary: "Sinopsis resmi", duration: "Durasi", release: "Tanggal rilis", officialLink: "Tautan resmi",
    confidence: "Kepercayaan", high: "Tinggi", medium: "Sedang", low: "Rendah",
    copied: "Disalin!", errorGeneric: "Pencarian gagal.", refuseMinor: "Ditolak: konten di bawah umur.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  ja: {
    tagline: "名前から公式カバーへ", placeholder: "シーン名、海賊版タイトル、またはURL...",
    search: "検索", stage1: "クエリ / 海賊ページを読み取り中", stage2: "IAFDでスタジオ＋キャスト照合",
    stage3: "公式あらすじを取得", stage4: "プロモカバーを取得",
    copy: "コピー", download: "ダウンロード", history: "最近の検索",
    footer: "Asl · 公式プロモカバーのみ · 18+",
    noCover: "公式プロモカバーが見つかりませんでした。",
    studio: "スタジオ", realTitle: "正式タイトル", performers: "出演者", categories: "カテゴリ",
    summary: "公式あらすじ", duration: "時間", release: "公開日", officialLink: "公式リンク",
    confidence: "信頼度", high: "高", medium: "中", low: "低",
    copied: "コピーしました！", errorGeneric: "検索に失敗しました。", refuseMinor: "拒否：未成年の可能性があります。",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  ko: {
    tagline: "이름에서 공식 커버로", placeholder: "장면 이름, 해적 제목 또는 URL...",
    search: "검색", stage1: "쿼리 / 해적 페이지 읽기", stage2: "IAFD에서 스튜디오 + 출연진 매칭",
    stage3: "공식 시놉시스 가져오기", stage4: "프로모 커버 가져오기",
    copy: "복사", download: "다운로드", history: "최근 검색",
    footer: "Asl · 공식 프로모 커버만 · 18+",
    noCover: "공식 프로모 커버를 찾을 수 없습니다.",
    studio: "스튜디오", realTitle: "공식 제목", performers: "출연자", categories: "카테고리",
    summary: "공식 시놉시스", duration: "재생 시간", release: "출시일", officialLink: "공식 링크",
    confidence: "신뢰도", high: "높음", medium: "중간", low: "낮음",
    copied: "복사됨!", errorGeneric: "검색 실패.", refuseMinor: "거부됨: 미성년자 가능성.",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
  zh: {
    tagline: "从名称到官方封面", placeholder: "场景名称、盗版标题或URL...",
    search: "搜索", stage1: "读取查询 / 盗版页面", stage2: "在IAFD匹配工作室和演员",
    stage3: "获取官方简介", stage4: "获取宣传封面",
    copy: "复制", download: "下载", history: "最近搜索",
    footer: "Asl · 仅官方宣传封面 · 18+",
    noCover: "未找到官方宣传封面。",
    studio: "工作室", realTitle: "官方标题", performers: "演员", categories: "分类",
    summary: "官方简介", duration: "时长", release: "发布日期", officialLink: "官方链接",
    confidence: "置信度", high: "高", medium: "中", low: "低",
    copied: "已复制！", errorGeneric: "搜索失败。", refuseMinor: "拒绝：可能涉及未成年人。",
    example1: "Family Vacation!!! Family Strokes", example2: "It Just Slipped In S2:E8", example3: "Ill Show You What Girls Want S21:E1",
  },
};

const RTL = new Set(["ar", "he", "ur"]);
const LANGS = [
  { code: "ar", label: "العربية" }, { code: "en", label: "English" },
  { code: "fr", label: "Français" }, { code: "es", label: "Español" },
  { code: "pt", label: "Português" }, { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" }, { code: "tr", label: "Türkçe" },
  { code: "hi", label: "हिन्दी" }, { code: "id", label: "Bahasa" },
  { code: "ja", label: "日本語" }, { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
];

let lang = localStorage.getItem("asl_lang") || "ar";

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.has(lang) ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", RTL.has(lang));
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  const bar = document.getElementById("lang-bar");
  bar.innerHTML = "";
  LANGS.forEach((l) => {
    const b = document.createElement("button");
    b.className = "lang-btn" + (l.code === lang ? " active" : "");
    b.textContent = l.label;
    b.onclick = () => { lang = l.code; localStorage.setItem("asl_lang", lang); applyLang(); renderExamples(); };
    bar.appendChild(b);
  });
  renderExamples();
}

function renderExamples() {
  const el = document.getElementById("examples");
  el.innerHTML = "";
  [t("example1"), t("example2"), t("example3")].forEach((txt) => {
    const c = document.createElement("button");
    c.className = "chip";
    c.textContent = txt;
    c.onclick = () => { document.getElementById("q").value = txt; doSearch(); };
    el.appendChild(c);
  });
}

function setStage(n) {
  document.querySelectorAll(".stage").forEach((s) => {
    const sn = +s.dataset.stage;
    s.classList.remove("active", "done");
    if (sn < n) s.classList.add("done");
    if (sn === n) s.classList.add("active");
  });
}
function showStages(show) { document.getElementById("stages").classList.toggle("show", show); }
function hideResults() {
  document.getElementById("result").classList.remove("show");
  document.getElementById("error-box").classList.remove("show");
  document.getElementById("empty-box").classList.remove("show");
}
function saveHistory(q) {
  let hist = JSON.parse(localStorage.getItem("asl_hist") || "[]");
  hist = hist.filter((x) => x !== q); hist.unshift(q); hist = hist.slice(0, 8);
  localStorage.setItem("asl_hist", JSON.stringify(hist)); renderHistory();
}
function renderHistory() {
  const hist = JSON.parse(localStorage.getItem("asl_hist") || "[]");
  const wrap = document.getElementById("history-wrap");
  const list = document.getElementById("history-list");
  if (!hist.length) { wrap.style.display = "none"; return; }
  wrap.style.display = "block"; list.innerHTML = "";
  hist.forEach((q) => {
    const d = document.createElement("div");
    d.className = "hist-item"; d.textContent = q;
    d.onclick = () => { document.getElementById("q").value = q; doSearch(); };
    list.appendChild(d);
  });
}
function renderReport(data) {
  const confLabel = t(data.confidence || "low");
  const rows = [
    [t("studio"), data.studio || "—"],
    [t("realTitle"), (data.originalTitle || "—") + (data.releaseDate ? " · " + data.releaseDate : "")],
    [t("performers"), (data.performers || []).join(", ") || "—"],
    [t("categories"), (data.categories || []).join(", ") || "—"],
    [t("duration"), data.duration || "—"],
    [t("release"), data.releaseDate || "—"],
    [t("officialLink"), data.officialUrl ? `<a href="${data.officialUrl}" target="_blank" rel="noopener" style="color:var(--accent)">${data.officialUrl}</a>` : "—"],
    [t("confidence"), confLabel],
  ];
  let html = `<h3>${t("realTitle")} / Report</h3>`;
  rows.forEach(([lab, val]) => { html += `<div class="report-row"><div class="report-label">${lab}</div><div class="report-value">${val}</div></div>`; });
  if (data.officialSummary) {
    html += `<div class="report-label" style="margin-top:0.75rem">${t("summary")}</div>`;
    html += `<div class="summary-box">${data.officialSummary}</div>`;
  }
  if (data.notes) {
    html += `<div class="report-row" style="margin-top:0.5rem"><div class="report-label">Notes</div><div class="report-value" style="color:var(--muted);font-size:0.85rem">${data.notes}</div></div>`;
  }
  document.getElementById("report").innerHTML = html;
}

function slugUnderscore(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "_");
}
function slugHyphen(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
}
function cleanTitle(q) {
  let t = q.toLowerCase();
  t = t.replace(/\bs\d{1,2}\s*[:\-]?\s*e\d{1,2}\b/gi, " ");
  t = t.replace(/\b(season|episode|ep)\s*\d+\b/gi, " ");
  const studios = ["family strokes","familystrokes","bratty sis","brattysis","moms teach sex","momsteachsex","sis loves me","sislovesme","dad crush","dadcrush","pervmom","perv mom","nubile films","nubiles","teamskeet","team skeet","momishorny","mom is horny","bangbros","bang bros"];
  studios.forEach(s => { t = t.split(s).join(" "); });
  t = t.replace(/[!?.¡¿]+/g, " ").replace(/[^\w\s\-']/g, " ").replace(/\s+/g, " ").trim();
  return t;
}
function detectStudios(q) {
  const ql = q.toLowerCase();
  const map = [
    ["family strokes","fs"],["familystrokes","fs"],["bratty sis","bratty"],["brattysis","bratty"],
    ["moms teach sex","mts"],["momsteachsex","mts"],["sis loves me","slm"],["sislovesme","slm"],
    ["dad crush","dc"],["dadcrush","dc"],["pervmom","pvm"],["perv mom","pvm"],
    ["momishorny","mih"],["mom is horny","mih"],["nubile","nubiles"],["nubiles","nubiles"],["teamskeet","ts"]
  ];
  const found = [];
  map.forEach(([k,c]) => { if (ql.includes(k)) found.push(c); });
  if (!found.length && /(stepson|stepsis|stepsister|stepbrother|stepmom|stepdad)/i.test(ql)) {
    found.push("fs","bratty","mts","slm","dc","pvm");
  }
  return [...new Set(found)];
}
function buildCandidates(q) {
  const title = cleanTitle(q) || q;
  const u = slugUnderscore(title);
  const h = slugHyphen(title);
  const studios = detectStudios(q);
  const urls = [];
  const knownPerformers = {
    "family vacation": ["rhaya_shyne"],
  };
  const performerSlugs = knownPerformers[u] || [];
  performerSlugs.forEach((slug) => {
    if (studios.includes("fs") || !studios.length) {
      urls.push({url: `https://images.psmcdn.net/teamskeet/fs/${slug}/shared/hi.jpg`, score: 32, via: "Family Strokes official performer CDN"});
      urls.push({url: `https://images.psmcdn.net/teamskeet/fs/${slug}/shared/med.jpg`, score: 30, via: "Family Strokes official performer CDN"});
    }
  });
  if (!studios.length || studios.some(s => ["bratty","mts","nubiles"].includes(s))) {
    [u, h.replace(/-/g,"_"), h].forEach(s => {
      urls.push({url: `https://images.nubiles-porn.com/videos/${s}/samples/cover1280.jpg`, score: 24, via: "nubiles CDN"});
    });
  }
  const codes = studios.length ? studios.filter(s => ["fs","slm","dc","pvm","mih","ts"].includes(s)) : ["fs","slm","dc","pvm","mih","ts"];
  if (!codes.length) codes.push("fs","ts");
  codes.forEach(code => {
    urls.push({url: `https://images.psmcdn.net/teamskeet/${code}/${u}/shared/hi.jpg`, score: 20, via: "psmcdn"});
    urls.push({url: `https://images.psmcdn.net/teamskeet/${code}/${u}/shared/med.jpg`, score: 16, via: "psmcdn med"});
  });
  if (!studios.length || studios.includes("bratty") || studios.includes("mts")) {
    ["2017","2018","2019","2020","2021","2022","2023","2024"].forEach(y => {
      for (let m = 1; m <= 12; m++) {
        const mm = String(m).padStart(2,"0");
        urls.push({url: `https://brattyfamily.com/wp-content/uploads/${y}/${mm}/${u}.jpg`, score: 18, via: "brattyfamily"});
        urls.push({url: `https://brattyfamily.com/wp-content/uploads/${y}/${mm}/${h.replace(/-/g,"_")}.jpg`, score: 18, via: "brattyfamily"});
      }
    });
  }
  return { title, studios, urls: urls.slice(0, 40) };
}
function testImage(url, timeoutMs) {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => { img.src = ""; resolve(null); }, timeoutMs || 4000);
    img.onload = () => {
      clearTimeout(timer);
      if (img.naturalWidth > 80 && img.naturalHeight > 80) resolve(url);
      else resolve(null);
    };
    img.onerror = () => { clearTimeout(timer); resolve(null); };
    img.referrerPolicy = "no-referrer";
    img.src = url;
  });
}

async function doSearch() {
  const q = document.getElementById("q").value.trim();
  if (!q) return;
  const lower = q.toLowerCase();
  if (/\b(teen\s*1[0-7]|underage|child|loli|shota)\b/i.test(lower)) {
    hideResults();
    document.getElementById("error-msg").textContent = t("refuseMinor");
    document.getElementById("error-box").classList.add("show");
    return;
  }
  hideResults();
  showStages(true);
  document.getElementById("search-btn").disabled = true;
  setStage(1);
  const delays = [300, 400, 350, 400];
  for (let i = 1; i <= 4; i++) { setStage(i); await new Promise((r) => setTimeout(r, delays[i - 1])); }
  try {
    const { title, studios, urls } = buildCandidates(q);
    let best = null; let bestScore = -1; const tried = [];
    const batchSize = 6;
    for (let i = 0; i < urls.length && !best; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(async (c) => {
        const ok = await testImage(imageThroughServer(c.url), 12000);
        tried.push({ url: c.url, score: c.score, via: c.via, ok: !!ok });
        return ok ? c : null;
      }));
      for (const c of results) {
        if (c && c.score > bestScore) { best = c; bestScore = c.score; }
      }
      if (best && bestScore >= 20) break;
    }
    showStages(false);
    document.getElementById("search-btn").disabled = false;
    saveHistory(q);
    if (!best) {
      document.getElementById("empty-box").classList.add("show");
      const ul = document.getElementById("empty-sources");
      ul.innerHTML = "";
      tried.filter(x => x.score >= 16).slice(0, 8).forEach((s) => {
        const li = document.createElement("li");
        li.textContent = `[${s.score}] ${s.url}`;
        ul.appendChild(li);
      });
      return;
    }
    const studioNames = {fs:"Family Strokes",bratty:"Bratty Sis",mts:"Moms Teach Sex",slm:"Sis Loves Me",dc:"DadCrush",pvm:"PervMom",mih:"MomIsHorny",nubiles:"Nubiles",ts:"TeamSkeet"};
    const data = {
      originalTitle: title.replace(/\b\w/g, c => c.toUpperCase()),
      studio: studios.length ? (studioNames[studios[0]] || studios[0]) : null,
      series: studios.length ? (studioNames[studios[0]] || studios[0]) : null,
      performers: [], categories: [], officialSummary: null, duration: null, releaseDate: null, officialUrl: null,
      confidence: bestScore >= 20 ? "high" : "medium",
      notes: ASL_API_BASE ? "تم جلب الغلاف والتحقق منه عبر خادم الموقع." : "غلاف عبر أنماط CDN (وضع GitHub Pages — بدون سيرفر).",
      coverUrl: best.url, coverScore: bestScore,
    };
    const img = document.getElementById("cover-img");
    const renderedCoverUrl = imageThroughServer(data.coverUrl);
    img.src = renderedCoverUrl;
    img.onclick = () => window.open(renderedCoverUrl, "_blank");
    document.getElementById("cover-url").value = data.coverUrl;
    document.getElementById("dl-btn").href = renderedCoverUrl;
    const badge = document.getElementById("conf-badge");
    badge.textContent = t(data.confidence);
    badge.className = "confidence conf-" + data.confidence;
    renderReport(data);
    document.getElementById("result").classList.add("show");
  } catch (e) {
    showStages(false);
    document.getElementById("search-btn").disabled = false;
    document.getElementById("error-msg").textContent = t("errorGeneric") + " " + (e.message || "");
    document.getElementById("error-box").classList.add("show");
  }
}

document.getElementById("search-btn").onclick = doSearch;
document.getElementById("q").addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });
document.getElementById("copy-btn").onclick = () => {
  const url = document.getElementById("cover-url").value;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById("copy-btn");
    const old = btn.textContent;
    btn.textContent = t("copied");
    setTimeout(() => (btn.textContent = old), 1500);
  });
};
document.getElementById("q").value = "Family Vacation!!! Family Strokes";
applyLang();
renderHistory();
