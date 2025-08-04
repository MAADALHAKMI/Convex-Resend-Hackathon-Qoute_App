import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    favoriteCharacter: v.id("characters"),
    createdAt: v.number(),
     emailFrequencyDays: v.optional(v.number()),
  }),

  characters: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  quotes: defineTable({
    characterId: v.id("characters"),
    text: v.string(),
    mood: v.string(),
  }).index("by_characterId", ["characterId"]),


  userMoods: defineTable({
    userId: v.id("users"),
    mood: v.string(),
    updatedAt: v.number(),


  }),
  emailLogs: defineTable({
    userId: v.optional(v.id("users")),
    characterId: v.optional(v.id("characters")),
    quoteId: v.optional(v.id("quotes")),
    sentAt: v.number(),
    type: v.string(),
    emailId: v.string(),
    status: v.string(),
  }),
  

  
});
