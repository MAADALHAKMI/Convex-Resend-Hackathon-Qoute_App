import { components, internal } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation } from "./_generated/server";

// تفعيل Resend Component
export const resend: Resend = new Resend(components.resend, {
  testMode: false, // خليها false عشان ترسل فعلي
});

// استدعاء عند وصول أي تحديث حالة من Resend

export const handleEmailEvent = resend.defineOnEmailEvent(async (ctx, args) => {
  console.log("📩 Email Event from Resend:", args.id, args.event);

  await ctx.runMutation(internal.mutations.emailLogs.updateEmailStatus, {

    emailId: args.id,
    status: args.event.type
    
  });
});



export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "onboarding@resend.dev",
      to: "alhakmimaad@gmail.com",
      subject: "Hi there",
      html: "This is a test email",
    });
  },
});
      
   
 

