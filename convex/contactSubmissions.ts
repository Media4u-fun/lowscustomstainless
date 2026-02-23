import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("contactSubmissions").order("desc").collect();
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    return results.length;
  },
});

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("contactSubmissions", {
      ...args,
      read: false,
      replied: false,
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { read: true });
  },
});

export const markReplied = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { replied: true, read: true });
  },
});

export const remove = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
