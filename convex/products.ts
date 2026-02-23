import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {
    category: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, { category, published }) => {
    const results = await ctx.db.query("products").collect();
    return results.filter((p) => {
      if (category && category !== "all" && p.category !== category) return false;
      if (published !== undefined && p.published !== published) return false;
      return true;
    });
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("products")
      .filter((q) => q.and(q.eq(q.field("featured"), true), q.eq(q.field("published"), true)))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    material: v.string(),
    finish: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    leadTime: v.optional(v.string()),
    inStock: v.boolean(),
    published: v.boolean(),
    images: v.array(v.string()),
    stripeProductId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    material: v.optional(v.string()),
    finish: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    leadTime: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
    stripeProductId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
