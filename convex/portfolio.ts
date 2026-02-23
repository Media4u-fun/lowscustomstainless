import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {
    sector: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, { sector, published }) => {
    let q = ctx.db.query("portfolio");
    const results = await q.collect();
    return results.filter((p) => {
      if (sector && sector !== "all" && p.sector !== sector) return false;
      if (published !== undefined && p.published !== published) return false;
      return true;
    });
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("portfolio")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("published"), true))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("portfolio")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    sector: v.string(),
    services: v.array(v.string()),
    materials: v.array(v.string()),
    clientName: v.string(),
    location: v.optional(v.string()),
    year: v.optional(v.number()),
    featured: v.boolean(),
    published: v.boolean(),
    images: v.array(v.string()),
    coverImage: v.optional(v.string()),
    caseStudy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("portfolio", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("portfolio"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    sector: v.optional(v.string()),
    services: v.optional(v.array(v.string())),
    materials: v.optional(v.array(v.string())),
    clientName: v.optional(v.string()),
    location: v.optional(v.string()),
    year: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
    images: v.optional(v.array(v.string())),
    coverImage: v.optional(v.string()),
    caseStudy: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("portfolio") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
