import { internal } from "_generated/api";
import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { sendMoodBasedQuoteLogic } from "logic/sendMoodBasedQuoteLogic";
import { sendQuoteEmailLogic } from "logic/sendQuoteEmailLogic";



export const sendQuoteEmailInternal = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await sendQuoteEmailLogic(ctx, args.userId);
  },
});

export const sendMoodBasedQuote = internalMutation({
  args: {
    userId: v.id("users"),
    characterId: v.id("characters"),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    return await sendMoodBasedQuoteLogic(ctx, args.userId, args.characterId, args.mood);
  },
});


