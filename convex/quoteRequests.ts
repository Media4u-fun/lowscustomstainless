import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const results = await ctx.db.query("quoteRequests").order("desc").collect();
    if (status && status !== "all") return results.filter((r) => r.status === status);
    return results;
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db
      .query("quoteRequests")
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
    company: v.optional(v.string()),
    projectType: v.string(),
    sector: v.optional(v.string()),
    description: v.string(),
    budget: v.optional(v.string()),
    timeline: v.optional(v.string()),
    fileUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("quoteRequests", {
      ...args,
      status: "new",
      read: false,
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("quoteRequests") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { read: true });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("quoteRequests"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { status });
  },
});

export const addNote = mutation({
  args: { id: v.id("quoteRequests"), notes: v.string() },
  handler: async (ctx, { id, notes }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { notes });
  },
});

export const remove = mutation({
  args: { id: v.id("quoteRequests") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
