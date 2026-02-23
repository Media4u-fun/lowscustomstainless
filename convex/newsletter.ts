import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("newsletter").order("desc").collect();
  },
});

export const subscribe = mutation({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, { email, name }) => {
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) {
      if (!existing.subscribed) {
        await ctx.db.patch(existing._id, { subscribed: true });
      }
      return existing._id;
    }
    return ctx.db.insert("newsletter", {
      email,
      name,
      subscribed: true,
      subscribedAt: Date.now(),
    });
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { subscribed: false });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("newsletter") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
