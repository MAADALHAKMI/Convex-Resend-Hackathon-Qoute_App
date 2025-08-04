import { DatabaseReader } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export async function sendMoodBasedQuoteLogic(
  ctx: { db: DatabaseReader; scheduler: any },
  userId: Id<"users">,
  characterId: Id<"characters">,
  mood: string
) {
  const user = await ctx.db.get(userId);
  if (!user?.email) throw new Error("User not found or missing email");

  const character = await ctx.db.get(characterId);
  if (!character) throw new Error("Character not found");

  const quotes = await ctx.db
    .query("quotes")
    .filter((q) => q.eq(q.field("characterId"), characterId))
    .filter((q) => q.eq(q.field("mood"), mood))
    .collect();

  if (quotes.length === 0) throw new Error("No quotes found");

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
// 15 دقيقة * 60 ثانية = 900 ثانية
await ctx.scheduler.runAfter(100, internal.actions.sendEmailAction.sendMoodQuoteEmail, {
  email: user.email,
  characterName: character.name,
  quoteText: randomQuote.text,
  mood,
  userId,
  characterId,
});


  return { success: true };
}
