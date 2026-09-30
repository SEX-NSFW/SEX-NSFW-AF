export type Lang = "ar" | "en";

export const COPY = {
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
    emptyBody:
      "أدخل عنوان المشهد كما هو — بأي لغة. نُظهر الغلاف الرسمي فقط بعد التحقق من الصورة، دون اختراع روابط.",
    notFoundTitle: "لا يوجد تطابق قوي",
    notFoundBody:
      "لم نجد غلافاً يشارك ثلاث كلمات مفتاحية على الأقل مع العنوان. جرّب الصيغة الرسمية كما تظهر لدى الاستوديو.",
    unverifiedTitle: "تعذّر التحقق من الصورة",
    unverifiedBody: "عُثر على مرشح لكن ملف الصورة لم يُحمَّل. أعد المحاولة بعد قليل.",
    invalid: "أدخل عنواناً أطول من حرفين.",
    hint: "العناوين وأسماء المؤدين تُعرض كما هي بالحروف اللاتينية.",
    langLabel: "اللغة",
    urlLabel: "رابط الصورة المباشر",
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
    emptyBody:
      "Enter the scene title as published — any language. We only show a URL after the image file is verified. No invented links.",
    notFoundTitle: "No strong match",
    notFoundBody:
      "Nothing shared at least three meaningful words with that title. Try the official studio wording.",
    unverifiedTitle: "Image could not be verified",
    unverifiedBody: "A candidate was found but the image file did not load. Try again shortly.",
    invalid: "Enter a title longer than two characters.",
    hint: "Film titles and performer names stay in Latin script.",
    langLabel: "Language",
    urlLabel: "Direct image URL",
  },
} as const;
