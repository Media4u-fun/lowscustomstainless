import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

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

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("emailReplies").order("desc").collect();
  },
});
