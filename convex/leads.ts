import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const results = await ctx.db.query("leads").order("desc").collect();
    if (status && status !== "all") return results.filter((l) => l.status === status);
    return results;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.string(),
    notes: v.optional(v.string()),
    value: v.optional(v.number()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("leads", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("leads"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    value: v.optional(v.number()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});

export const createLeadFromDeposit = internalMutation({
  args: {
    name: v.string(),
    businessName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    industry: v.string(),
    website: v.optional(v.string()),
    notes: v.optional(v.string()),
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.string(),
    depositAmount: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      company: args.businessName,
      source: "website-factory-deposit",
      status: "qualified",
      notes: `${args.notes || ""}\nIndustry: ${args.industry}\nLocation: ${args.location || "N/A"}\nDeposit: $${args.depositAmount / 100}\nStripe Session: ${args.stripeSessionId}`,
      website: args.website,
    });
  },
});
