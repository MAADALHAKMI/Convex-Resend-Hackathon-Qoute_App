📬 Quote Sender - Convex Backend
A comprehensive project for sending quotes via email using Convex for data management and Resend for creative and unique email delivery.

🧠 Project Idea
📌 Full Scenario
Upon first login:
The user logs in.

The user is asked to select their favorite character.

The automatic sending system is activated.

Afterwards:
⏰ Every day or every two days (configurable), a random quote from the favorite character is sent to the user’s email.

If the user later enters the app and selects:
Their current mood (e.g., sad, happy…)

A character to respond to this mood

📩 An immediate email is sent from that character based on the mood.

⚠️ Note: Daily quotes from the favorite character continue without interruption.

🛠️ Technologies Used
Convex – Database and backend functions

Resend – Email sending service

React Email (@react-email/components) – For designing responsive and dynamic emails

Webhooks – For handling event-based triggers

TypeScript – Programming language

Cron Jobs – For scheduled automatic sending

📁 Project Structure
graphql
Copy
Edit
convex/
├── schema.ts                 # Database schema definitions
├── mutations/                # Mutation functions (for data changes)
│   ├── users.ts
│   ├── emailLogs.ts
│   └── usersInternal.ts      # Internal user-related mutations
├── characters.ts             # Character-related functions
├── quotes.ts                 # Quote-related functions
├── emailLogs.ts              # Email logs management
├── actions/                  # Email sending actions
│   └── sendEmailAction.ts
├── logic/                    # Business logic modules
│   ├── sendMoodBasedQuoteLogic.ts
│   └── sendQuoteEmailLogic.ts
├── cron.ts                   # Cron jobs for scheduled sending
├── http.ts                   # HTTP related functions (API handlers & webhooks)
└── index.ts                  # Export all functions
⏰ Cron Jobs (cron.ts)
ts
Copy
Edit
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

  // 300_000 ms = 5 minutes (can be adjusted as needed)
  await ctx.scheduler.runAfter(
    100, // Delay before sending (adjustable)
    internal.actions.sendEmailAction.sendMoodQuoteEmail,
    {
      email: user.email,
      characterName: character.name,
      quoteText: randomQuote.text,
      mood,
      userId,
      characterId,
    }
  );

  return { success: true };
}
💡 Tip: You can change the delay value in runAfter() to schedule the mood-based email sending at your desired time (e.g., 5 minutes, 15 minutes, etc.).

🎨 Creative Email Sending
✨ Unique Features:
Responsive HTML email design with RTL support.

Dynamic colors and emojis based on mood.

Personalized signatures and greetings based on time of day.

Custom email headers for user tracking.

Daily Quote Template:

Beautiful gradient background

Smart greeting (Good morning / Good evening)

"Quote of the Day" badge

Eye-catching quote design

Creative signature

Mood-Based Email Template:

Gradient colors matching mood

Mood emoji

Personalized message design

📝 Supported Moods
happy - Happy 😊

sad - Sad 😢

excited - Excited 🤩

calm - Calm 😌

motivated - Motivated 💪

📊 Monitoring
All email sending operations are logged in emailLogs.

The sending history can be tracked for each user.

Clear error messages in Arabic.

Success and failure statistics for cron jobs.

## 🚀 Future Development

* [ ] Add an advanced authentication system.
* [ ] Add customization settings for users.
* [ ] Add detailed usage statistics.
* [ ] Support scheduled email sending.
* [ ] Add an admin interface.
* [ ] Support voice-enabled email sending.
* [ ] Add interactive quotes.

## 📞 Support

* Review Convex documentation: [https://docs.convex.dev](https://docs.convex.dev)
* Review Resend documentation: [https://resend.com/docs](https://resend.com/docs)

---

**ملاحظة**: تأكد من إعداد `RESEND_API_KEY` بشكل صحيح لتفعيل إرسال البريد الإلكتروني.

``` 