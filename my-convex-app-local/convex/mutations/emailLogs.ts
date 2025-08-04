import { internalMutation, query } from "../_generated/server";
import { v } from "convex/values";

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

export const addEmailLog = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    characterId: v.optional(v.id("characters")),
    quoteId: v.optional(v.id("quotes")),
    sentAt: v.number(),
    type: v.string(),
    emailId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailLogs", {
      userId: args.userId,          // ممكن undefined
      characterId: args.characterId,
      quoteId: args.quoteId,
      sentAt: args.sentAt,
      type: args.type,
      emailId: args.emailId,
      status: args.status,
      
    });
  },
});

export const updateEmailStatusByUser = internalMutation({
  args: {
    userId: v.id("users"),
    emailId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("emailLogs")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .order("desc") // آخر إيميل
      .take(1);

    if (logs.length > 0) {
      await ctx.db.patch(logs[0]._id, {
        emailId: args.emailId,
        status: args.status,
      });
    } else {
      console.warn("⚠️ No email log found for user", args.userId);
    }
  },
});

  // 1. عدد الإيميلات لـ userId معين ونوعها "daily"
export const countByUserAndTypeDaily = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(log => log.userId === args.userId && log.type === "daily").length;
  },
});

// 2. عدد الإيميلات لـ userId معين ونوعها "mood"
export const countByUserAndTypeMood = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(log => log.userId === args.userId && log.type === "mood").length;
  },
});

// 3. عدد الإيميلات لـ userId معين بغض النظر عن النوع
export const countByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(log => log.userId === args.userId).length;
  },
});

// 4. عدد الإيميلات لـ userId معين و characterId معين بغض النظر عن النوع
export const countByUserAndCharacter = query({
  args: {
    userId: v.id("users"),
    characterId: v.id("characters"),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(
      log => log.userId === args.userId && log.characterId === args.characterId
    ).length;
  },
});

// عدد الإيميلات لـ userId معين وال status = "delivered"
export const countByUserAndStatusDelivered = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(
      log => log.userId === args.userId && log.status === "delivered"
    ).length;
  },
});

// عدد الإيميلات لـ userId معين وال status = "sent"
export const countByUserAndStatusSent = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("emailLogs").collect();
    return logs.filter(
      log => log.userId === args.userId && log.status === "sent"
    ).length;
  },
});

