import { v } from "convex/values";
import { internalMutation, mutation, query } from "../_generated/server";
import bcrypt from "bcryptjs";
import { components } from "../_generated/api";
import { Resend } from "@convex-dev/resend";
import { sendQuoteEmailLogic } from "logic/sendQuoteEmailLogic";
import { sendMoodBasedQuoteLogic } from "logic/sendMoodBasedQuoteLogic";





export const register = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    favoriteCharacter: v.id("characters"),
  },
  handler: async (ctx, args) => {
    // التحقق إذا الإيميل موجود مسبقاً
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // إضافة المستخدم الجديد
    const userId = await ctx.db.insert("users", {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: args.password, // بدون تشفير
      favoriteCharacter: args.favoriteCharacter,
      createdAt: Date.now(),
      emailFrequencyDays: undefined, // ممكن تحددها لاحقاً
    });

    // إرجاع بيانات المستخدم
    return {
      id: userId,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      favoriteCharacter: args.favoriteCharacter,
      createdAt: Date.now(),
    };
  },
});





export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // البحث عن المستخدم بناءً على البريد
    const user = await ctx.db.query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // تحقق كلمة المرور (بدون تشفير لأن التسجيل أيضاً بدون تشفير)
    if (user.password !== args.password) {
      throw new Error("Invalid email or password");
    }

    // إرجاع بيانات المستخدم (ممكن تستخدمها في Flutter لتخزين حالة الدخول)
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      favoriteCharacter: user.favoriteCharacter,
      createdAt: user.createdAt,
    };
  },
});


// تغيير كلمة السر مع تحقق كلمة السر الحالية
export const changePassword = mutation({
  args: {
    userId: v.id("users"),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isCurrentPasswordValid = await bcrypt.compare(args.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error("Incorrect current password");
    }
    const hashedNewPassword = await bcrypt.hash(args.newPassword, 10);
    await ctx.db.patch(args.userId, { password: hashedNewPassword });
  },
});

// تحديث بيانات المستخدم (البريد، الأسماء، الشخصية)
export const update = mutation({
  args: {
    id: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    favoriteCharacter: v.optional(v.id("characters")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});


export const setFavoriteCharacter = mutation({
  args: {
    userId: v.id("users"),
    characterId: v.id("characters"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      favoriteCharacter: args.characterId,
    });
  },
});

// حذف المستخدم

// ===== الدوال الجديدة المطلوبة =====

// دالة اختيار المزاج والشخصية (ترسل إيميل فوراً ولا تغيّر المفضلة)


// دالة اختيار الشخصية المفضلة
export const selectFavoriteCharacter = mutation({
  args: {
    userId: v.id("users"),
    characterId: v.id("characters"),
  },
  handler: async (ctx, args) => {
    // التحقق من وجود المستخدم
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // التحقق من وجود الشخصية
    const character = await ctx.db.get(args.characterId);
    if (!character) {
      throw new Error("الشخصية غير موجودة");
    }

    // تحديث الشخصية المفضلة
    await ctx.db.patch(args.userId, {
      favoriteCharacter: args.characterId,
    });

    return { 
      success: true, 
      message: "تم تحديث الشخصية المفضلة بنجاح",
      character: character
    };
  },
});



///////////////////////////////////////////////////////////////////////
// export const sendQuoteEmail = internalMutation({
//   args: {
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.db.get(args.userId);
//     if (!user) throw new Error("User not found");
//     if (!user.favoriteCharacter) throw new Error("User has no favorite character");
//     if (!user.email) throw new Error("User has no email");

//     const character = await ctx.db.get(user.favoriteCharacter);
//     if (!character) throw new Error("Character not found");

//     const quotes = await ctx.db
//       .query("quotes")
//       .withIndex("by_characterId", (q) =>
//         q.eq("characterId", user.favoriteCharacter)
//       )
//       .collect();

//     if (quotes.length === 0) throw new Error("No quotes found");
//     const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

//     await ctx.scheduler.runAfter(0, internal.sendEmailAction.sendQuoteEmailAction, {
//       email: user.email,
//       quoteText: randomQuote.text,
//       characterName: character.name,
//       firstName: user.firstName ?? "صديقي",
//     });

//     return { success: true };
//   },
// });







export const sendQuoteEmailPublic = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await sendQuoteEmailLogic(ctx, args.userId);
  },
});






// export const sendMoodBasedQuote = internalMutation({
 

//   args: {
//     userId: v.id("users"),
//     characterId: v.id("characters"),
//     mood: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.db.get(args.userId);
//     if (!user?.email) throw new Error("User not found or missing email");

//     const character = await ctx.db.get(args.characterId);
//     if (!character) throw new Error("Character not found");

//     const quotes = await ctx.db
//       .query("quotes")
//       .filter((q) => q.eq(q.field("characterId"), args.characterId))
//       .filter((q) => q.eq(q.field("mood"), args.mood))
//       .collect();

//     if (quotes.length === 0) throw new Error("No quotes found");

//     const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

//     // 👇 هذا هو Node Action الذي أنشأناه
//     await ctx.scheduler.runAfter(0, internal.sendEmailAction.sendMoodQuoteEmail, {
//       email: user.email,
//       characterName: character.name,
//       quoteText: randomQuote.text,
//       mood: args.mood,
//     });
    
//     console.log(user?.email);
//     return { success: true };
     
//   },
// });





export const sendMoodBasedQuotePublic = mutation({
  args: {
    userId: v.id("users"),
    characterId: v.id("characters"),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    return await sendMoodBasedQuoteLogic(ctx, args.userId, args.characterId, args.mood);
  },
});


