// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();
http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const bodyText = await request.text();

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const emailId = body.data?.email_id;
    const eventType = body.type;
    const userId = body.data?.headers?.find(
      (h: any) => h.name === "X-User-ID"
    )?.value;

    if (!userId) {
      console.error("❌ Missing X-User-ID in webhook");
      return new Response("Missing X-User-ID", { status: 400 });
    }

    let status: string;
    switch (eventType) {
      case "email.delivered":
        status = "delivered";
        break;
      case "email.bounced":
        status = "bounced";
        break;
      case "email.failed":
        status = "failed";
        break;
      case "email.opened":
        status = "opened";
        break;
      case "email.sent":
        status = "sent";
        break;
      default:
        status = "unknown";
    }

    console.log("📩 Webhook Event:", { userId, emailId, status });

    await ctx.runMutation(internal.mutations.emailLogs.updateEmailStatusByUser, {
      userId,
      emailId,
      status,
    });

    return new Response("ok", { status: 200 });
  }),
});
export default http;
