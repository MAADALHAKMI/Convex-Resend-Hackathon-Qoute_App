import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// استعلام: الحصول على اقتباس بالـ ID
export const get = query({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// استعلام: الحصول على جميع الاقتباسات
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("quotes").collect();
  },
});

// استعلام: الحصول على اقتباسات حسب الشخصية
export const getByCharacter = query({
  args: { characterId: v.id("characters") },
  handler: async (ctx, args) => {
    const quotes = await ctx.db.query("quotes").collect();
    return quotes.filter(quote => quote.characterId === args.characterId);
  },
});

// استعلام: الحصول على اقتباسات حسب المزاج
export const getByMood = query({
  args: { mood: v.string() },
  handler: async (ctx, args) => {
    const quotes = await ctx.db.query("quotes").collect();
    return quotes.filter(quote => quote.mood === args.mood);
  },
});

// استعلام: الحصول على اقتباسات حسب الشخصية والمزاج
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

// استعلام: الحصول على اقتباس عشوائي حسب الشخصية والمزاج
export const getRandomByCharacterAndMood = query({
  args: { 
    characterId: v.id("characters"),
    mood: v.string()
  },
  handler: async (ctx, args) => {
    const quotes = await ctx.db.query("quotes").collect();
    const matchingQuotes = quotes.filter(quote => 
      quote.characterId === args.characterId && quote.mood === args.mood
    );
    
    if (matchingQuotes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * matchingQuotes.length);
    return matchingQuotes[randomIndex];
  },
});

// إنشاء اقتباس جديد
export const create = mutation({
  args: {
    characterId: v.id("characters"),
    text: v.string(),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    const quoteId = await ctx.db.insert("quotes", {
      characterId: args.characterId,
      text: args.text,
      mood: args.mood,
    });
    return quoteId;
  },
});

// حذف اقتباس
export const remove = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
}); 


