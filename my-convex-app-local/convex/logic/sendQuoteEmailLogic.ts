import { DatabaseReader } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { internal } from "../_generated/api";
export async function sendQuoteEmailLogic(
  ctx: { db: DatabaseReader; scheduler: any },
  userId: Id<"users">
) {
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");
  if (!user.favoriteCharacter) throw new Error("User has no favorite character");
  if (!user.email) throw new Error("User has no email");

  const character = await ctx.db.get(user.favoriteCharacter);
  if (!character) throw new Error("Character not found");

  const quotes = await ctx.db
    .query("quotes")
    .withIndex("by_characterId", (q: any) =>
      q.eq("characterId", user.favoriteCharacter)
    )
    .collect();

  if (quotes.length === 0) throw new Error("No quotes found");

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // إرسال الإيميل الآن
  await ctx.scheduler.runAfter(
    0,
    internal.actions.sendEmailAction.sendQuoteEmailAction,
    {
      email: user.email,
      quoteText: randomQuote.text,
      characterName: character.name,
      firstName: user.firstName ?? "صديقي",
      userId,
      characterId: character._id,
      
    }
  );

  // جدولة تنفيذ نفس الدالة بعد 24 ساعة (86,400,000 ms)
  await ctx.scheduler.runAfter(
    8_400_000, // 24 ساعة
    internal.mutations.usersinternal.sendQuoteEmailInternal, // استدعاء النسخة internal
    { userId }
  );
  
  
  

  return { success: true };
}
