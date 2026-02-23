import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";
import { getAuthenticatedUser } from "./auth";

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const results = await ctx.db.query("orders").order("desc").collect();
    if (status && status !== "all") return results.filter((o) => o.status === status);
    return results;
  },
});

export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];
    return ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    subtotal: v.number(),
    total: v.number(),
    stripeSessionId: v.optional(v.string()),
    shippingName: v.optional(v.string()),
    shippingEmail: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("orders", { ...args, status: "pending" });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("orders"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { status });
  },
});

export const addNote = mutation({
  args: { id: v.id("orders"), notes: v.string() },
  handler: async (ctx, { id, notes }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { notes });
  },
});
