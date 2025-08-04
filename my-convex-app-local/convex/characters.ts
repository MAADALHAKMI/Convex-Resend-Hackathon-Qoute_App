import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// استعلام: الحصول على شخصية بالـ ID
export const get = query({
  args: { id: v.id("characters") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// استعلام: الحصول على جميع الشخصيات
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("characters").collect();
  },
});

// استعلام: الحصول على شخصية بالاسم
export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const characters = await ctx.db.query("characters").collect();
    return characters.find(character => character.name === args.name);
  },
});

// إنشاء شخصية جديدة
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const characterId = await ctx.db.insert("characters", {
      name: args.name,
      description: args.description,
    });
    return characterId;
  },
});

// تحديث شخصية
export const update = mutation({
  args: {
    id: v.id("characters"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// حذف شخصية
export const remove = mutation({
  args: { id: v.id("characters") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
}); 

// الحصول على اقتباسات حسب الشخصية
export const getByCharacter = query({
  args: { characterId: v.id("characters") },
  handler: async (ctx, args) => {
    const quotes = await ctx.db.query("quotes").collect();
    return quotes.filter(quote => quote.characterId === args.characterId);
  },
});

// الحصول على اقتباسات حسب الشخصية والمزاج
export const getByCharacterAndMood = query({
  args: { 
    characterId: v.id("characters"),
    mood: v.string()
  },
  handler: async (ctx, args) => {
    const quotes = await ctx.db.query("quotes").collect();
    return quotes.filter(quote => 
      quote.characterId === args.characterId && quote.mood === args.mood
    );
  },
}); 