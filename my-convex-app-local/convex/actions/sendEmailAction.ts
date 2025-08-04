
// convex/sendEmailAction.ts
"use node"; // ضروري جدًا


import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { render } from "@react-email/render";
import QuoteEmail from "../emails/QuoteModeEmail"; 
import FavoriteCharacterEmail from "emails/QuoteCharEmail";
import { resend } from "sendEmail";
import { internal } from "_generated/api";


export const sendMoodQuoteEmail = internalAction({
  args: {
    email: v.string(),
    characterName: v.string(),
    quoteText: v.string(),
    mood: v.string(),
    userId: v.id("users"), // خليها إلزامية عشان دايم يكون موجود
    characterId: v.optional(v.id("characters")),
    quoteId: v.optional(v.id("quotes")),
  },
  handler: async (ctx, args) => {
    const html = await render(
      QuoteEmail({
        quote: args.quoteText,
        characterName: args.characterName,
        mood: args.mood,
      })
    );

    const emailId = await resend.sendEmail(ctx, {
      from: "onboarding@resend.dev",
      to: args.email,
      subject: `✨ Mood qoute "${args.mood}"`,
      html,
      headers: [
        { name: "X-User-ID", value: args.userId }, // 🔹 نضيف الهيدر هنا
      ],
    });

    console.log("📨 Mood Email sent, ID from Resend:", emailId);

    await ctx.runMutation(internal.mutations.emailLogs.addEmailLog, {
      userId: args.userId,
      characterId: args.characterId,
      quoteId: args.quoteId,
      sentAt: Date.now(),
      type: "mood",
      emailId, // ممكن نخليه فاضي "" إذا أردنا الاعتماد كليًا على الهيدر
      status: "sent",
    });

    return { success: true };
  },
});

export const sendQuoteEmailAction = internalAction({
  args: {
    email: v.string(),
    quoteText: v.string(),
    characterName: v.string(),
    firstName: v.string(),
    userId: v.id("users"), // جعلها إلزامية عشان دايمًا موجود
    characterId: v.optional(v.id("characters")),
    quoteId: v.optional(v.id("quotes")),
  },
  handler: async (ctx, args) => {
    const html = await render(
      FavoriteCharacterEmail({
        firstName: args.firstName,
        quote: args.quoteText,
        characterName: args.characterName,
      })
    );

    const emailId = await resend.sendEmail(ctx, {
      from: "onboarding@resend.dev",
      to: args.email,
      subject: `✨ اyour deaily qoute is here`,
      html,
      headers: [
        { name: "X-User-ID", value: args.userId.toString() }, // 🔹 نضيف الهيدر هنا
      ],
    });

    console.log("📨 Quote Email sent, ID from Resend:", emailId);

    await ctx.runMutation(internal.mutations.emailLogs.addEmailLog, {
      userId: args.userId,
      characterId: args.characterId,
      quoteId: args.quoteId,
      sentAt: Date.now(),
      type: "daily",
      emailId, // ممكن نخليه فاضي "" إذا أردنا الاعتماد كليًا على الهيدر
      status: "sent",
    });

    return { success: true };
  },
});
