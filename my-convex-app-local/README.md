# 📬 Quote Sender - Convex Backend

مشروع متكامل لإرسال الاقتباسات عبر البريد الإلكتروني باستخدام **Convex** لإدارة البيانات و**Resend** لإرسال البريد الإلكتروني بطريقة إبداعية وفريدة.

## 🧠 فكرة المشروع

### 📌 **السيناريو الكامل:**

#### **عند تسجيل الدخول لأول مرة:**
1. يسجل دخوله
2. يُطلب منه اختيار شخصيته المفضلة
3. يُفعّل نظام الإرسال التلقائي

#### **بعدها:**
- ⏰ **كل يوم أو كل يومين** (نحدده لاحقًا)، يتم إرسال اقتباس عشوائي من الشخصية المفضلة إلى بريده الإلكتروني.

#### **إذا دخل لاحقًا للتطبيق واختار:**
- موده الحالي (مثلاً: حزين، سعيد…)
- وشخصية ترد عليه في هذا المزاج
- 📩 **يتم إرسال إيميل فوري** من هذه الشخصية بناءً على المود.

⚠️ **لكن:** إرسال الاقتباسات اليومية من الشخصية المفضلة يبقى مستمرًا ولا يتوقف.

## 🛠️ التقنيات المستخدمة

- **Convex** - قاعدة البيانات والوظائف الخلفية
- **Resend** - إرسال البريد الإلكتروني بطريقة إبداعية
- **TypeScript** - لغة البرمجة
- **bcryptjs** - تشفير كلمات المرور
- **Cron Jobs** - الإرسال التلقائي

## 📁 هيكل المشروع

```
convex/
├── schema.ts              # تعريف قاعدة البيانات
├── users.ts               # فانكشنز المستخدمين
├── characters.ts          # فانكشنز الشخصيات
├── quotes.ts              # فانكشنز الاقتباسات
├── emailLogs.ts           # سجلات البريد الإلكتروني
├── sendEmail.ts           # إرسال البريد بطريقة إبداعية
├── cron.ts                # Cron Jobs للإرسال التلقائي
└── index.ts               # تصدير جميع الفانكشنز
```

## 🚀 الإعداد والتشغيل

### 1. تثبيت المتطلبات

```bash
npm install
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. إعداد المتغيرات البيئية

أنشئ ملف `.env.local` وأضف:

```env
# Convex Configuration
CONVEX_DEPLOY_KEY=your_convex_deploy_key_here

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
```

### 3. تشغيل المشروع

```bash
# تشغيل Convex محلياً
npx convex dev

# أو تشغيل مرة واحدة
npx convex dev --once
```

## 📋 الفانكشنز المتاحة

### 👤 **إدارة المستخدمين** (`users.ts`)

```typescript
// تسجيل مستخدم جديد
const userId = await mutation.users.register({
  firstName: "أحمد",
  lastName: "محمد",
  email: "ahmed@example.com",
  password: "password123",
  favoriteCharacter: characterId
});

// تسجيل الدخول
const user = await mutation.users.login({
  email: "ahmed@example.com",
  password: "password123"
});

// تغيير كلمة المرور
await mutation.users.changePassword({
  userId,
  currentPassword: "password123",
  newPassword: "newpassword123"
});

// تحديث الاسم
await mutation.users.updateName({
  userId,
  firstName: "أحمد الجديد",
  lastName: "محمد الجديد"
});

// اختيار الشخصية المفضلة
await mutation.users.selectFavoriteCharacter({
  userId,
  characterId: "character_id"
});

// اختيار المزاج والشخصية (ترسل إيميل فوراً)
await mutation.users.selectMoodAndCharacter({
  userId,
  mood: "happy",
  characterId: "character_id"
});

// تفعيل/إيقاف الإرسال اليومي
await mutation.users.enableDailyQuotes({ userId });
await mutation.users.disableDailyQuotes({ userId });
```

### 🎭 **إدارة الشخصيات** (`characters.ts`)

```typescript
// إنشاء شخصية جديدة
const characterId = await mutation.characters.create({
  name: "ألبرت أينشتاين",
  description: "عالم فيزياء مشهور"
});

// الحصول على جميع الشخصيات
const characters = await query.characters.list();

// الحصول على شخصية بالاسم
const character = await query.characters.getByName({ name: "ألبرت أينشتاين" });
```

### 💬 **إدارة الاقتباسات** (`quotes.ts`)

```typescript
// إنشاء اقتباس جديد
const quoteId = await mutation.quotes.create({
  characterId: "character_id",
  text: "الحياة مثل ركوب الدراجة، لكي تحافظ على توازنك يجب أن تستمر في التحرك",
  mood: "inspired"
});

// الحصول على اقتباسات حسب الشخصية والمزاج
const quotes = await query.quotes.getByCharacterAndMood({
  characterId: "character_id",
  mood: "happy"
});

// الحصول على اقتباس عشوائي
const randomQuote = await query.quotes.getRandomByCharacterAndMood({
  characterId: "character_id",
  mood: "inspired"
});
```

### 📧 **إرسال البريد الإلكتروني** (`sendEmail.ts`)

```typescript
// إرسال اقتباس يومي من الشخصية المفضلة
const result = await action.sendEmail.sendDailyQuoteToUser({
  userId: "user_id"
});

// إرسال اقتباس حسب المزاج والشخصية
const result = await action.sendEmail.sendMoodQuoteToUser({
  userId: "user_id",
  mood: "inspired",
  characterId: "character_id"
});
```

### ⏰ **Cron Jobs** (`cron.ts`)

المشروع يتضمن 3 cron jobs مختلفة:

1. **كل يوم في الساعة 9 صباحاً** - `sendDailyQuotes`
2. **كل يومين في الساعة 10 صباحاً** - `sendBiDailyQuotes`
3. **كل يوم في الساعة 7 صباحاً** - `sendMorningQuotes`

## 🎨 **الطريقة الإبداعية لإرسال البريد**

### ✨ **ميزات فريدة:**

1. **تصميم HTML متجاوب** باللغة العربية مع دعم RTL
2. **ألوان ديناميكية** حسب المزاج
3. **إيموجي ذكية** لكل مزاج
4. **توقيع إبداعي** حسب نوع البريد
5. **Headers مخصصة** للبريد الإلكتروني
6. **توقيت ذكي** للتحية (صباح الخير، مساء الخير)

### 🎨 **قالب البريد اليومي:**
- خلفية متدرجة جميلة
- تحية ذكية حسب الوقت
- شارة "اقتباس اليوم"
- تصميم مميز للاقتباس
- توقيع إبداعي

### 💭 **قالب البريد حسب المزاج:**
- ألوان متدرجة حسب المزاج
- إيموجي المزاج
- تصميم مخصص
- رسالة شخصية

## 🔧 التخصيص

### إضافة شخصيات جديدة

```typescript
await mutation.characters.create({
  name: "شخصية جديدة",
  description: "وصف الشخصية"
});
```

### إضافة اقتباسات جديدة

```typescript
await mutation.quotes.create({
  characterId: "character_id",
  text: "نص الاقتباس",
  mood: "happy"
});
```

### المزاجات المدعومة

- `happy` - سعيد 😊
- `sad` - حزين 😢
- `excited` - متحمس 🤩
- `calm` - هادئ 😌
- `motivated` - متحفز 💪
- `relaxed` - مسترخي 😴
- `inspired` - ملهم ✨
- `grateful` - ممتن 🙏
- `optimistic` - متفائل 🌈
- `peaceful` - مسالم 🕊️
- `energetic` - نشيط ⚡
- `thoughtful` - متفكر 🤔
- `joyful` - مبتهج 🎉
- `serene` - هادئ 🌿
- `determined` - مصمم 🔥
- `anxious` - قلق 😰
- `confident` - واثق 😎
- `curious` - فضولي 🤓
- `playful` - مرح 😄
- `reflective` - تأملي 🧘

## 🛡️ الأمان

- تشفير كلمات المرور باستخدام bcrypt
- التحقق من وجود المستخدم قبل إرسال البريد
- التحقق من وجود المزاج والشخصية المفضلة
- معالجة الأخطاء بشكل مناسب
- تسجيل جميع عمليات الإرسال

## 📊 المراقبة

- جميع عمليات الإرسال تُسجل في `emailLogs`
- يمكن تتبع تاريخ الإرسال لكل مستخدم
- رسائل خطأ واضحة باللغة العربية
- إحصائيات النجاح والفشل في cron jobs

## 🚀 التطوير المستقبلي

- [ ] إضافة نظام مصادقة متقدم
- [ ] إضافة إعدادات تخصيص للمستخدمين
- [ ] إضافة إحصائيات مفصلة
- [ ] دعم إرسال البريد بجدولة مخصصة
- [ ] إضافة واجهة إدارية
- [ ] دعم إرسال البريد بالصوت
- [ ] إضافة اقتباسات تفاعلية

## 📞 الدعم

للمساعدة أو الاستفسارات، يمكنك:
- فتح issue في GitHub
- مراجعة وثائق Convex: https://docs.convex.dev
- مراجعة وثائق Resend: https://resend.com/docs

---

**ملاحظة**: تأكد من إعداد `RESEND_API_KEY` بشكل صحيح لتفعيل إرسال البريد الإلكتروني.

## 🎯 **كيفية الاستخدام في Frontend:**

```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// تسجيل الدخول
const login = useMutation(api.users.login);
const user = await login({ email: "user@example.com", password: "password" });

// اختيار الشخصية المفضلة
const selectFavorite = useMutation(api.users.selectFavoriteCharacter);
await selectFavorite({ userId: user.id, characterId: "character_id" });

// اختيار المزاج والشخصية (ترسل إيميل فوراً)
const selectMood = useMutation(api.users.selectMoodAndCharacter);
await selectMood({ 
  userId: user.id, 
  mood: "inspired", 
  characterId: "character_id" 
});

// الحصول على الشخصيات
const characters = useQuery(api.characters.list);

// الحصول على الاقتباسات
const quotes = useQuery(api.quotes.getByCharacter, { characterId: "character_id" });
``` 