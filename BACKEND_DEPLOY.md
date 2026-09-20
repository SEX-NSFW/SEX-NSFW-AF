# تشغيل خادم البحث وProxy الصور

يحتوي `asl/server.py` الآن على نقطتين:

- `GET /api/search?q=...` للبحث في الصفحات الرسمية وبيانات `og:image`.
- `GET /api/image?url=...` لجلب صورة متحقق منها عبر الخادم مع Cache لمدة يوم.

الخادم لا يقبل Proxy إلا للنطاقات الموجودة في القائمة المسموحة، ويحد حجم الصورة إلى 8 MB ويتحقق من نوعها وبايتاتها قبل إعادتها.

## نشر الخادم

أنشئ Web Service من مستودع GitHub باستخدام `Dockerfile` أو ملف `render.yaml`. يجب أن يكون رابط الخادم النهائي بصيغة HTTPS، مثل:

```text
https://YOUR-BACKEND.example.com
```

## ربط GitHub Pages

بعد الحصول على رابط الخادم، أضف هذا السطر قبل تحميل `app.js` في `index.html`:

```html
<script>window.ASL_API_BASE = "https://YOUR-BACKEND.example.com";</script>
<script src="app.js"></script>
```

أو استبدل سطر تحميل `app.js` الحالي بهذين السطرين. عندها ستستخدم الواجهة الخادم لفحص الصور وعرضها بدل الاعتماد على تحميل CDN مباشرة من المتصفح.

## اختبار محلي

```bash
PORT=8765 python3 asl/server.py
curl "http://127.0.0.1:8765/api/image?url=https%3A%2F%2Fiili.io%2FnTed3hX.jpg" -o /tmp/image.jpg
```

## CORS بأمان

الخادم لا يستخدم `Access-Control-Allow-Origin: *`. يسمح فقط بالأصل `https://sex-nsfw.github.io` وبالعناوين المحلية الخاصة بالاختبار. إذا تغيّر نطاق الواجهة، أضف الأصل الجديد إلى `ALLOWED_ORIGINS` في `asl/server.py` بدل فتحه لجميع المواقع. لا تستخدم `Access-Control-Allow-Credentials` ولا تضع مفاتيح أو بيانات دخول في الواجهة العامة.
