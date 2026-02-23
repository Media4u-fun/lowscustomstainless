import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: { published: v.optional(v.boolean()) },
  handler: async (ctx, { published }) => {
    const results = await ctx.db.query("blog").order("desc").collect();
    if (published !== undefined) return results.filter((p) => p.published === published);
    return results;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db.query("blog").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("blog", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("blog"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    published: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("blog") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
