import { defineApp } from "convex/server";
import resendComponent from "@convex-dev/resend/convex.config";

const app = defineApp();
app.use(resendComponent);
export default app;

