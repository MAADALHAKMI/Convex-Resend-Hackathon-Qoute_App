/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_sendEmailAction from "../actions/sendEmailAction.js";
import type * as characters from "../characters.js";
import type * as emailLogs from "../emailLogs.js";
import type * as emails_QuoteCharEmail from "../emails/QuoteCharEmail.js";
import type * as emails_QuoteModeEmail from "../emails/QuoteModeEmail.js";
import type * as http from "../http.js";
import type * as index from "../index.js";
import type * as logic_sendMoodBasedQuoteLogic from "../logic/sendMoodBasedQuoteLogic.js";
import type * as logic_sendQuoteEmailLogic from "../logic/sendQuoteEmailLogic.js";
import type * as mutations_emailLogs from "../mutations/emailLogs.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations_usersinternal from "../mutations/usersinternal.js";
import type * as quotes from "../quotes.js";
import type * as sendEmail from "../sendEmail.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/sendEmailAction": typeof actions_sendEmailAction;
  characters: typeof characters;
  emailLogs: typeof emailLogs;
  "emails/QuoteCharEmail": typeof emails_QuoteCharEmail;
  "emails/QuoteModeEmail": typeof emails_QuoteModeEmail;
  http: typeof http;
  index: typeof index;
  "logic/sendMoodBasedQuoteLogic": typeof logic_sendMoodBasedQuoteLogic;
  "logic/sendQuoteEmailLogic": typeof logic_sendQuoteEmailLogic;
  "mutations/emailLogs": typeof mutations_emailLogs;
  "mutations/users": typeof mutations_users;
  "mutations/usersinternal": typeof mutations_usersinternal;
  quotes: typeof quotes;
  sendEmail: typeof sendEmail;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        "mutation",
        "internal",
        { emailId: string },
        null
      >;
      cleanupAbandonedEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      cleanupOldEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      get: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          createdAt: number;
          errorMessage?: string;
          finalizedAt: number;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          opened: boolean;
          replyTo: Array<string>;
          resendId?: string;
          segment: number;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
          subject: string;
          text?: string;
          to: string;
        } | null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          errorMessage: string | null;
          opened: boolean;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        } | null
      >;
      handleEmailEvent: FunctionReference<
        "mutation",
        "internal",
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject: string;
          text?: string;
          to: string;
        },
        string
      >;
    };
  };
};
