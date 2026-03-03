import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const insertLog = mutation({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    sourceType: v.string(),
    sourceId: v.string(),
    sentAt: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("emailReplies", args);
  },
});
