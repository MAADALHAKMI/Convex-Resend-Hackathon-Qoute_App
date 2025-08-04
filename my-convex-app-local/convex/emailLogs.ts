import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// استعلام: الحصول على سجل بريد بالـ ID
export const get = query({
  args: { id: v.id("emailLogs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// استعلام: الحصول على جميع سجلات البريد
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("emailLogs").collect();
  },
});

// استعلام: الحصول على سجلات البريد حسب المستخدم
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(log => log.userId === args.userId);
  },
});

// استعلام: الحصول على سجلات البريد حسب الشخصية
export const getByCharacter = query({
  args: { characterId: v.id("characters") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(log => log.characterId === args.characterId);
  },
});

// استعلام: الحصول على سجلات البريد حسب النوع
export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(log => log.type === args.type);
  },
});

// // إنشاء سجل بريد جديد
// export const create = mutation({
//   args: {
//     userId: v.id("users"),
//     characterId: v.id("characters"),
//     quoteId: v.id("quotes"),
//     sentAt: v.number(),
//     type: v.string(), // "daily" أو "mood"
//   },
//   handler: async (ctx, args) => {
//     const logId = await ctx.db.insert("emailLogs", {
//       userId: args.userId,
//       characterId: args.characterId,
//       quoteId: args.quoteId,
//       sentAt: args.sentAt,
//       type: args.type,
//       status: "pending",
//       error: null,

//     });
//     return logId;
//   },
// });

// حذف سجل بريد
export const remove = mutation({
  args: { id: v.id("emailLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
}); 




export const updateEmailStatus = internalMutation({
  args: {
    emailId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs")
      .filter(q => q.eq(q.field("emailId"), args.emailId))
      .collect();

    if (logs.length > 0) {
      await ctx.db.patch(logs[0]._id, { status: args.status });
    } else {
      console.warn("⚠️ Email log not found for", args.emailId);
    }
  }
});
